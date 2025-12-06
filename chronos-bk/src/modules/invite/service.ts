import calendarUserModel from "../../models/CalendarUserModel";

import {PermissionsType} from "../../types";
import {generateInviteToken, verifyInvitationToken} from "../security/jwt";
import {sendInvitationEmail} from "../notification/mailSender";
import calendarModel from "../../models/CalendarModel";
import userModel from "../../models/UserModel";

const BASEURL = process.env.client ?? "http://localhost:5173";

export const invitationLinkService = async (userId: string, calendarId: string, permissions: PermissionsType): Promise<string> => {
  const calendarUser = await calendarUserModel.findOne({userId: userId, calendarId: calendarId}).exec();
  if (!calendarUser) throw new Error("CalendarUser not found");
  if (!calendarUser.permissions.manageParticipants) throw new Error("You don't have the permission to invite people");
  console.log(permissions);
  const token = generateInviteToken(calendarId, permissions);
  return `${BASEURL}/invite/accept/${token}`;
}

export const invitationEmailService = async (userId: string, calendarId: string, permissions: PermissionsType, email: string) => {
  const url = await invitationLinkService(userId, calendarId, permissions);
  const calendar = await calendarModel.findById(calendarId).exec();
  if (!calendar) throw new Error("Calendar not found");
  const inviter = await userModel.findById(userId).exec();
  if (!inviter) throw new Error("User not found");
  await sendInvitationEmail(email, url, calendar.name, inviter.login);
}

export const acceptInvitationService = async (userId: string, token: string) => {
  const {calendarId, permissions} = await verifyInvitationToken(token);
  console.log("service: ", userId, calendarId, permissions);
  const exists = await calendarUserModel.findOne({userId, calendarId});
  if (exists) return;
  await calendarUserModel.insertOne({userId: userId, calendarId: calendarId, permissions: permissions, color: "#9A7CC5FF"});
}
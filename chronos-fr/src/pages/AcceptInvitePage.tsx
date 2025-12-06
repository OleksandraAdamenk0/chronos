import { useEffect, useState } from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GET } from "@/utils/api";

function AcceptInvitePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [calendarId, setCalendarId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Invalid invitation link.");
      return;
    }

    const acceptInvite = async () => {
      try {
        const result = await GET(`invite/accept/${token}`);

        if (!result.success) {
          setStatus("error");
          setError(result.error || "Failed to accept invitation.");
          return;
        }

        setCalendarId(result.data.calendarId);
        setStatus("success");
      } catch (err: any) {
        if (err.status === 401) navigate("/login", {state: {path: location.pathname}});
        setStatus("error");
        setError(err?.message || "Something went wrong.");
      }
    };

    acceptInvite();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            Calendar Invitation
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6 py-6">

          {status === "loading" && (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Verifying your invitation…
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <p className="text-accent-foreground-500 font-medium text-center">{error}</p>
              <Button variant="outline" onClick={() => navigate("/")}>
                Back to Home
              </Button>
            </>
          )}

          {status === "success" && (
            <>
              <p className="text-center text-accent-foreground font-medium">
                You have successfully joined the calendar!
              </p>

              <Button
                onClick={() => navigate(`/calendar/${calendarId}`)}
                className="w-full"
              >
                Go to Calendar
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AcceptInvitePage;
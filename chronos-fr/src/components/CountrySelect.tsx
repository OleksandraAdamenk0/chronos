import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type CountryType = {
  name: string
  flag: string
}

interface CountrySelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function CountrySelect({
                                        value,
                                        onChange,
                                        placeholder = "Country",
                                        disabled = false,
                                      }: CountrySelectProps) {
  const [countries, setCountries] = useState<CountryType[]>([])

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,cca2")
      .then(res => res.json())
      .then(countries => {
        const list = countries.map((c: any) => ({
          name: c.name.common,
          flag: `https://flagcdn.com/w40/${c.cca2.toLowerCase()}.png`,
        }))
        setCountries(list)
      })
  }, [])

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {countries.map(country => (
          <SelectItem key={country.name} value={country.name}>
            <div className="flex items-center gap-2">
              <img src={country.flag} alt={country.name} width={24} height={20} />
              <span>{country.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

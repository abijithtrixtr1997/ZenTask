import { useState, useEffect } from "react";
import { TextInput, Flex, Switch } from "@mantine/core";

interface DateTimePickerProps {
  setSelectedTime: (time: string) => void;
}

export const DateTimePicker = ({ setSelectedTime }: DateTimePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [hours, setHours] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("");
  const [period, setPeriod] = useState<boolean>(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (type: "hours" | "minutes", value: string) => {
    // Allow only numeric input and limit length to 2
    const numericValue = value.replace(/\D/g, "");

    if (type === "hours") {
      if (
        numericValue === "" ||
        (parseInt(numericValue) >= 0 && parseInt(numericValue) <= 12)
      ) {
        setHours(numericValue);
      }
    } else if (type === "minutes") {
      if (
        numericValue === "" ||
        (parseInt(numericValue) >= 0 && parseInt(numericValue) <= 59)
      ) {
        setMinutes(numericValue);
      }
    }
  };

  useEffect(() => {
    if (selectedDate && hours && minutes) {
      const formattedTime = `${selectedDate} ${hours.padStart(
        2,
        "0"
      )}:${minutes.padStart(2, "0")} ${period ? "PM" : "AM"}`;
      setSelectedTime(formattedTime);
    }
  }, [selectedDate, hours, minutes, period, setSelectedTime]);

  return (
    <div className="datetime-picker">
      <Flex gap="10px" align="center" justify="flex-start">
        {/* Date Input */}
        <TextInput
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="datetime-picker__input"
          size="sm"
        />

        {/* Time Inputs */}
        <Flex gap="10px">
          {/* Hour Input */}
          <TextInput
            type="text"
            value={hours}
            size="sm"
            onChange={(e) => handleTimeChange("hours", e.target.value)}
            className="datetime-picker__input"
            placeholder="HH"
            maxLength={2}
          />

          {/* Minute Input */}
          <TextInput
            type="text"
            value={minutes}
            size="sm"
            onChange={(e) => handleTimeChange("minutes", e.target.value)}
            className="datetime-picker__input"
            placeholder="MM"
            maxLength={2}
          />

          {/* AM/PM Selector */}
          <Switch
            checked={period}
            onChange={(e) => setPeriod(e.target.checked)}
            size="sm"
            label={period ? "PM" : "AM"}
            className="datetime-picker__input"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </Flex>
      </Flex>
    </div>
  );
};

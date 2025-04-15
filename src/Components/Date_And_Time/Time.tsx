import { useState, useEffect } from "react";
import { TextInput, Flex, Switch } from "@mantine/core";

interface DateTimePickerProps {
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

export const DateTimePicker = ({
  selectedTime,
  setSelectedTime,
}: DateTimePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [hours, setHours] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("");
  const [period, setPeriod] = useState<boolean>(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  useEffect(() => {
    if (selectedTime) {
      const dateObj = new Date(selectedTime);

      // Set formatted date as yyyy-mm-dd (or customize)
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
      const dd = String(dateObj.getDate()).padStart(2, "0");
      setSelectedDate(`${yyyy}-${mm}-${dd}`);

      // Extract hours and minutes
      let hrs = dateObj.getHours();
      const mins = String(dateObj.getMinutes()).padStart(2, "0");
      console.log(hrs);

      setMinutes(mins);

      // Determine AM/PM and convert to 12-hour format
      const isPM = hrs >= 12;
      hrs = hrs % 12 || 12;
      setHours(hrs.toString());
      setPeriod(isPM);
    }
  }, [selectedTime]);

  const handleTimeChange = (type: "hours" | "minutes", value: string) => {
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

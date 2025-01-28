const HandleExperienceDate = (start, end) => {
  let dateStart, dateEnd;

  // Check if start date is valid
  const validStart = !isNaN(Date.parse(start));
  dateStart = validStart
    ? new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "short",
      }).format(new Date(start))
    : "Invalid Date"; // Fallback value if invalid

  // If end is "Present", just return it as the end date
  if (end === "Present") {
    dateEnd = end;
  } else {
    // Check if end date is valid
    const validEnd = !isNaN(Date.parse(end));
    dateEnd = validEnd
      ? new Intl.DateTimeFormat("en-GB", {
          year: "numeric",
          month: "short",
        }).format(new Date(end))
      : "Invalid Date"; // Fallback value if invalid
  }

  return `${dateStart} - ${dateEnd}`;
};

export default HandleExperienceDate;

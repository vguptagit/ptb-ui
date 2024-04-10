export function getErrorMessage(response) {
  switch (response.status) {
    case 404:
      return "File not found, please try again...";
    case 500:
      return "Internal Server Error, please try again...";
    default:
      return "Something went wrong, please try again...";
  }
}

export function downloadFile(blob, fileName) {
  // Creating new object of PDF file
  const fileURL = window.URL.createObjectURL(blob);

  // Setting various property values
  const alink = document.createElement("a");
  alink.href = fileURL;
  alink.download = fileName;
  alink.click();
}

function getDate(d) {
  const arr = d.split(" ");
  const date = arr[0].split(".").reverse().join("-");
  const result = [date, arr[1]].join("T");
  return result
}

getDate("31.01.2022 13:28:01");

const http = require("http");
const fs = require("fs");
const requests = require("requests");
const readFile = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempVal, OrgVal) => {
  //   console.log("tempVal", tempVal);
  let temprature = tempVal.replace("{%tempval%}", OrgVal.main.temp);
  //   console.log("temprature", temprature);
  temprature = temprature.replace("{%tempmin%}", OrgVal.main.temp_min);
  temprature = temprature.replace("{%tempmax%}", OrgVal.main.temp_max);
  temprature = temprature.replace("{%city%}", OrgVal.name);
  temprature = temprature.replace("{%country%}", OrgVal.sys.country);
  temprature = temprature.replace("{%tempstatus%}", OrgVal.weather[0].main);
  return temprature;
};
const server = http.createServer();
const createServerRequest = server((request, response) => {
  if (request.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Lahore&appid=1e96e81f766873da2c82ca84982c36e8"
    )
      .on("data", (chunk) => {
        const ObjectData = JSON.parse(chunk);
        const ArrData = [ObjectData];
        // console.log(ArrData);
        const realTimeData = ArrData.map((val, i) =>
          replaceVal(readFile, val)
        ).toString(); //.join("");
        console.log("realTimeData", realTimeData);
        response.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        response.end();
      });
  } else {
    response.writeHead(404, "page not found");
    response.end();
  }
});
server.listen(8000, "127.0.0.1");

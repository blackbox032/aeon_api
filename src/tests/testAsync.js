async function doAsync(param1) {
  return new Promise((resolve, reject) => {
    switch (param1) {
      case true:
        resolve("Resolved");
        break;
      case false:
        reject("Failed");
    }
  });
}

//blocking function using "doAsync().then()"
function execAsync(param1) {
  doAsync(param1).then(result => {
    console.log("Result inside async .then() - ", result);
    return result;
  });
}

//async function using "await doAsync"
//javascript will throw an error if you use await in a non-async function
async function awaitAsync(param1) {
  ret = await doAsync(param1);
  console.log("Result in async function that awaits async call - ", ret);
}

//blocking function to test what happens when we call either of the above functions
function callingCode() {
  ret = execAsync(true);
  console.log("Result from calling code after doAsync.then() - ", ret);
  ret2 = awaitAsync(true);
  console.log("Result from calling code after await doAsync() - ", ret2);
}

callingCode();

var obj = {
  category : "all",
  difficulty : "all",
  price : "all",
  publish_year : "all", 
  rating : "all",
  enrolled_students : "all",
  duration : "all",
  price_rating : "1",
  price_numberofstudents : "1",
  rating_numberofstudents : "1",
  // yeni eklenenler
  price_duration : "1",
  rating_duration : "1",
  numberofstudents_duration : "1"
}

function reset(){
  var sliders = document.getElementsByClassName("slider");
  for(var i = 0; i<sliders.length; i++){
    sliders[i].value = 0;
    obj[sliders[i].getAttribute("data-id")] = "1";
    document.getElementById(sliders[i].getAttribute("data-id")).innerHTML = "equal importance";
  }
}

const openTab = (e, tabid) => {
  if(tabid == "logouttab"){
    log_out();
    return;
  }
  console.log("clicked "+ tabid);
  var i, tabcontent, tabbtns;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tabbtns = document.getElementsByClassName("topbarbtn");
  for (i = 0; i < tabbtns.length; i++) {
    tabbtns[i].className = tabbtns[i].className.replace(" activebtn", "");
  }
  document.getElementById(tabid).style.display = "block";
  e.currentTarget.className += " activebtn";
};



const scrolling = (e, el) => {
  
  //console.log(el.scrollTop);
  var stck = document.getElementsByClassName("stickyfind");
  if (el.scrollTop > 100) {
    stck[0].style.opacity = 0;
    stck[0].style.transform = "translateY(-1000px)";
  } else {
    stck[0].style.opacity = 1;
    stck[0].style.transform = "translateY(0)";
  }
}

const showVal = (e, num) => {
  var el = document.getElementById(e.currentTarget.getAttribute("data-id"));

  if(num == 0)
    el.innerHTML = "Value = equal importance", obj[e.currentTarget.getAttribute("data-id")] = 1;
  else{
    if(num < 0)
      num--, el.innerHTML = "x/y = 1/" + (-num), obj[e.currentTarget.getAttribute("data-id")] = 1/(-num);
    else
      num++, el.innerHTML = "x/y = " + num, obj[e.currentTarget.getAttribute("data-id")] = num;
  }

  console.log("Value for ", e.currentTarget.getAttribute("data-id")," = " ,obj[e.currentTarget.getAttribute("data-id")]);
  console.log("Current OBJ : ", obj);
}

const ok = () => {
  console.log("OKEY");
  takeData("okey");
}


$(document).ready(function () {
  
  //$("#dtBasicExample").DataTable();
  takeData();
  $(".dataTables_length").addClass("bs-select");


});


const cannot = (e) => {
  e.stopPropagation();
}


const cnames = [".category", ".difficulty", ".publish_year", ".price", ".rating", ".duration"]

for(var cname of cnames){
  console.log("cname : " + cname)
  const element = document.querySelector(cname);

  element.addEventListener("change", (event) => {
    //obj[event.target.getAttribute("data-id")] = event.target.value;
    obj[event.target.getAttribute("data-id")] = event.target.options[event.target.selectedIndex].value;

    console.log("object updated = ",event.target.getAttribute("data-id"), " with : ",obj[event.target.getAttribute("data-id")] );

    update(event.target.getAttribute("data-id"));

  });
}


user = {
  username :"", password :""
}

function sign_up(){
  var u = document.getElementById("sign_up_username").value;
  var p = document.getElementById("sign_up_password").value;
  console.log("username", u , " pass", p);
  postData("http://127.0.0.1:8000/sign_up", {username:u, password: p}).then((data) => {
    console.log("Situation : ", data.success);
    if(data.success){
      document.getElementById("signupok").style.display = "block";
      document.getElementById("signupno").style.display = "none";
      
    }else{
      document.getElementById("signupok").style.display = "none";
      document.getElementById("signupno").style.display = "block";
    }
  });
}

function log_in() {
  var u = document.getElementById("sign_in_username").value;
  var p = document.getElementById("sign_in_password").value;
  user.username = u;
  user.password = p;

  postData("http://127.0.0.1:8000/log_in", {username:u, password: p}).then((data) => {
      console.log("Situation : ", data.success);
      if(data.success){
        document.getElementById("loginbtn").style.display = "none";
        document.getElementById("logoutbtn").style.display = "flex";
        document.getElementById("findcoursebtn").style.display = "flex";
        document.getElementById("howtobtn").style.display = "flex";
        document.getElementById("bichartsbtn").style.display = "flex";
        document.getElementById("contactbtn").style.display = "flex";
        document.getElementById("aboutusbtn").style.display = "flex";
        document.getElementById("homebtn").click();
        document.getElementById("showerror").style.display = "none";
      }else{
        document.getElementById("loginbtn").style.display = "flex";
        document.getElementById("logoutbtn").style.display = "none";
        document.getElementById("findcoursebtn").style.display = "none";
        document.getElementById("howtobtn").style.display = "none";
        document.getElementById("contactbtn").style.display = "none";
        document.getElementById("bichartsbtn").style.display = "none";
        document.getElementById("aboutusbtn").style.display = "none";
        document.getElementById("showerror").style.display = "block";
      }
  });
}

function log_out() {
    user.username = "";
    user.password = "";
    document.getElementById("loginbtn").style.display = "flex";
    document.getElementById("logoutbtn").style.display = "none";
    document.getElementById("findcoursebtn").style.display = "none";
    document.getElementById("howtobtn").style.display = "none";
    document.getElementById("bichartsbtn").style.display = "none";
    document.getElementById("contactbtn").style.display = "none";
    document.getElementById("aboutusbtn").style.display = "none";
    document.getElementById("homebtn").click();
}

// Example POST method implementation:

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.

    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    
    body: JSON.stringify(data)
  });
  return response.json();
}


var lst2 = ["Category", "Difficulty", "Publish Year"];
// first call
postData("http://127.0.0.1:8000/hello_world", obj).then((data) => {

  var lst = [
    data.optionalCategory,
    data.optionalDifficulty, data.optionalPublish_year
  ];

  for(var i = 0; i<3; i++){
    const element = document.querySelector(cnames[i]);
    element.innerHTML = `<option selected value = "all">Select ${lst2[i]} (All)</option>`
    for(var str of lst[i]){
      element.innerHTML += `<option value="${str}">${str}</option>`;
    }
  }
});



// update the selections.
function update(which){
  var i;
  if (which == "category") {
    i = 1;
    obj.difficulty = "all";
    obj.publish_year = "all";

    takeData();

  } else if (which == "difficulty") {
    i = 2;
    obj.publish_year = "all";
    takeData();
  } else {
    takeData();
      return;
  }

  postData("http://127.0.0.1:8000/hello_world", obj).then((data) => {
    // JSON data parsed by `data.json()` call

    var lst = [
      data.optionalCategory,
      data.optionalDifficulty,
      data.optionalPublish_year,
    ];
    console.log("Update OBJ :", obj);
    console.log("Updated Selection difficulty : ", data.optionalDifficulty);
    console.log("Updated Selection p_year : ", data.optionalPublish_year);

    for (; i < 3; i++) {
      console.log("UPDATED : " + lst2[i]);
      const element = document.querySelector(cnames[i]);
      element.innerHTML = `<option selected value = "all">Select ${lst2[i]} (All)</option>`;
      for (var str of lst[i]) {
        element.innerHTML += `<option value="${str}">${str}</option>`;
      }
    }
    console.log("obj : ", obj)

  });
}


//takeData();

function takeData(what){
  console.log("myobj", obj);
    
    $("#dtBasicExample").DataTable().destroy();

    $("#table_body").html("");
    postData("http://127.0.0.1:8000/getData", obj).then((data) => {

      if(what == "okey"){
        console.log("AHP Value : ", data.ahp)
        if(parseFloat(data.ahp) >= 0.1){
          document.getElementsByClassName("successf")[0].style.display = "none";
          document.getElementsByClassName("error")[0].style.display =
            "block";
        }else{
          
          document.getElementsByClassName("error")[0].style.display = "none";
          document.getElementsByClassName("successf")[0].style.display = "block";

          var el = document.getElementsByClassName("animat")[0];
          el.style.display = "flex";
          setTimeout(() => {
            el.style.display = "none"; 
            document.getElementById("clsBtn").click();

          }, 3000);
          
          console.log("Consistent!");
          console.log("Data ", data.courses);
        }
      }

      

      for(var i = 0; i<data.courses.length; i++){
        var course = data.courses[i];

          $("#table_body").append(
            "<tr>"+
              "<td>"+ course.category + "</td>" +
              "<td>"+ course.title + "</td>" + 
              "<td>"+ course.organization + "</td>" + 
              /* "<td>"+ course.certificate + "</td>" +  */
              "<td>"+ course.rating + "</td>" + 
              "<td>"+ course.difficulty + "</td>"+
              "<td>"+ course.enrolled_students + "</td>"+
              "<td>"+ course.price + "</td>"+
              "<td>"+ course.price_category + "</td>"+
              "<td>"+ course.publish_year + "</td>"+
              "<td>"+ course.duration + "</td>"+
            "</tr>"
          );
      } 
      
      $("#dtBasicExample").DataTable().draw();
    });

}


/* for login */

 
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});



function changeImg(e){
  els = document.getElementsByClassName("img");
  for(var i = 0; i<els.length; i++)
    els[i].style.display = "none";
  document.getElementById(e.currentTarget.getAttribute("data-id")).style.display = "flex"
}
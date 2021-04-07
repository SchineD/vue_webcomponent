
class Autocomplete extends HTMLElement {

  connectedCallback() {
    this.innerHTML = `<style>
        * { box-sizing: border-box; }
body {
    font: 16px Arial;
}

.autocomplete {
    /*the container must be positioned relative:*/
    position: relative;
    display: inline-block;
}
input {
    border: 1px solid transparent;
    background-color: #f1f1f1;
    padding: 10px;
    font-size: 16px;
}
input[type=text] {
    background-color: #f1f1f1;
    width: 100%;
}
input[type=submit] {
    background-color: DodgerBlue;
    color: #fff;
}
.autocomplete-items {
    position: absolute;
    border: 1px solid #d4d4d4;
    border-bottom: none;
    border-top: none;
    z-index: 99;
    /*position the autocomplete items to be the same width as the container:*/
    top: 100%;
    left: 0;
    right: 0;
}
.autocomplete-items div {
    padding: 10px;
    cursor: pointer;
    background-color: #fff;
    border-bottom: 1px solid #d4d4d4;
}
.autocomplete-items div:hover {
    /*when hovering an item:*/
    background-color: #e9e9e9;
}
.autocomplete-active {
    /*when navigating through the items using the arrow keys:*/
    background-color: DodgerBlue !important;
    color: #ffffff;
}
        </style>
        <form autocomplete="off" action="/action_page.php">
                            <div class="autocomplete" style="width:300px;">
                                <input id="myInput" type="text" name="myCountry"      placeholder="Land">
                            </div>

                            </form>`;
  }

  disconnectedCallback() {
    this.innerHTML = "";
  }

}

window.customElements.define('auto-complete', Autocomplete);

window.onload=function() {
  function autocomplete(inp, arr) {

    let currentFocus;

    var el = document.getElementById('myInput');
    if (el) {

      // eslint-disable-next-line no-unused-vars
      inp.addEventListener("input", function (e) {
        let a, b, i, val = this.value;
        closeAllLists();
        if (!val) {
          return false;
        }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");

        this.parentNode.appendChild(a);

        for (i = 0; i < arr.length; i++) {
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            b = document.createElement("DIV");
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            // eslint-disable-next-line no-unused-vars
            b.addEventListener("click", function (e) {
              inp.value = this.getElementsByTagName("input")[0].value;
              closeAllLists();
            });
            a.appendChild(b);
          }
        }
      });

      inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode === 40) {
          currentFocus++;
          addActive(x);
        } else if (e.keyCode === 38) { //up
          currentFocus--;
          addActive(x);
        } else if (e.keyCode === 13) {
          e.preventDefault();
          if (currentFocus > -1) {
            if (x) x[currentFocus].click();
          }
        }
      });
    }

      function addActive(x) {

        if (!x) return false;

        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);

        x[currentFocus].classList.add("autocomplete-active");
      }

      function removeActive(x) {

        for (var i = 0; i < x.length; i++) {
          x[i].classList.remove("autocomplete-active");
        }
      }

      function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
          if (elmnt !== x[i] && elmnt !== inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }

      /*execute a function when someone clicks in the document:*/
      document.addEventListener("click", function (e) {
        closeAllLists(e.target);
      });
    }


  let countries;

  httpGetAsync("https://restcountries.eu/rest/v2/all?fields=name", function(response) {
    countries = JSON.parse(response).reduce((acc, val)=>[...acc, val.name], []);
    autocomplete(document.getElementById("myInput"), countries);
  });

  function httpGetAsync(theUrl, callback)
  {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
        callback(xmlHttp.response);
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
  }

};

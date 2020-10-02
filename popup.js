/* global variable to indicate whether all tabs are selected */
let selected = false;
let count = 1;
let clicked = false;



/* Create the sessions saved in storage */
function createSessions(sessions) {
  let sessions_div = document.getElementById("sessions");
  chrome.storage.sync.get((sessions ? [sessions] : null), function (data) {
    let session;
    for (let key in data) {
      if (sessions === undefined) {
        session = document.createElement("div");
        session.className = "session";
        session.id = `session-${count}`
        session.innerText = key;
      } else {
        session = document.getElementById(`session-${count}`);
        session.innerText = key;
      }

      let div = document.createElement("div");
      div.className = "dropdown accordion"
      div.id = `drop-${count}`

      let dropdown = document.createElement("button");
      dropdown.type = "button";
      dropdown.className = "drop-btn caret-off dropdown-toggle";
      dropdown.setAttribute("data-toggle", "dropdown");
      dropdown.setAttribute("aria-haspopup", "true");
      dropdown.setAttribute("aria-expanded", "false");

      let ellipsis = document.createElement("i");
      ellipsis.className = "fa fa-ellipsis-v";
      ellipsis.style = "color: white"
      ellipsis.setAttribute("aria-hidden", "true");
      dropdown.appendChild(ellipsis);


      div.appendChild(dropdown);

      let menu = document.createElement("div");
      menu.className = "dropdown-menu";
      div.appendChild(menu);

      //OPEN BUTTON
      let card1 = document.createElement("div");
      card1.className = "card";

      let open = document.createElement("button");
      open.type = "button";
      open.className = "panel-collapse collapse show opener menu-btn btn btn-primary dropdown-item ";
      open.id = `open-${count}`;
      open.innerText = "Open";
      open.onclick = () => openSession(key);

      let icon = document.createElement("i");
      icon.className = "drop-icon fas fa-external-link-alt";
      icon.setAttribute("aria-hidden", "true");
      icon.setAttribute("aria-controls", `${key}`);
      open.appendChild(icon);

      card1.appendChild(open)
      menu.appendChild(card1);

      //REMOVE BUTTON
      let card2 = document.createElement("div");
      card2.className = "card";
      let remove = document.createElement("button");
      remove.type = "button";
      remove.className = "panel-collapse collapse show remover menu-btn btn btn-primary dropdown-item";
      remove.id = `remove-${count}`;
      remove.innerText = "Remove";
      remove.onclick = () => removeSession(session.id, key);

      let icon2 = document.createElement("i");
      icon2.className = "drop-icon fa fa-trash-alt";
      icon2.setAttribute("aria-hidden", "true");
      icon2.setAttribute("aria-controls", `${key}`);
      remove.appendChild(icon2);

      card2.appendChild(remove);
      menu.appendChild(card2);

      //EDIT COMPONENT
      let card3 = document.createElement("div");
      card3.className = "card";

      let edit = document.createElement("a");
      edit.type = "button";
      edit.className = "menu-btn btn btn-primary dropdown-item";
      edit.id = `edit-${count}`;
      edit.innerText = "Edit";
      edit.setAttribute("data-toggle", "collapse");
      edit.setAttribute("href", `.panel-collapse`)

      let ed_ico = document.createElement("i");
      ed_ico.className = "fas fa-edit";
      ed_ico.setAttribute("aria-hidden", "true");
      ed_ico.setAttribute("aria-controls", `${key}`);
      edit.appendChild(ed_ico);

      let edit_card = document.createElement("div");
      edit_card.className = "card ";

      let edit_selection = document.createElement("div");
      edit_selection.id = `edit-selection-${count}`;
      edit_selection.className = "panel-collapse collapse edit-select-card";
      edit_selection.setAttribute("aria-hidden", "true");
      let edit_select_div = document.createElement("div");
      edit_select_div.className = "ed-sel-div";
      edit_select_div.id = "edit-parent"

      let deep_cnt = 1;
      for (let i = 0; i < data[key].length; i++) {
        let elem = document.createElement("div");
        console.log(data[key][i]['name'])
        elem.innerText = data[key][i]['name'];
        elem.className = "edit-tab";
        elem.id = `edit-tab-${count}-${deep_cnt}`
        let but = document.createElement("button");
        but.className = "del-tab"
        but.onclick = () => updateSession(key, data[key], data[key][i]['name'], elem.id);

        let delTab = document.createElement("i");
        delTab.className = "fas fa-times";
        delTab.setAttribute("aria-hidden", "true");
        but.appendChild(delTab)
        elem.appendChild(but);
        3

        edit_select_div.appendChild(elem);
        deep_cnt++;
      }

      edit_selection.appendChild(edit_select_div);
      card3.appendChild(edit);
      menu.appendChild(card3);
      edit_card.appendChild(edit_selection);
      menu.appendChild(edit_card);


      session.appendChild(div);
      sessions_div.appendChild(session);
      count++;
    }
  })
}

function updateSession(sessionName, seshArray, tabName, elemId) {

  let newSesh = seshArray.filter((value, index, arr) => {
    return value['name'] !== tabName
  });
  chrome.storage.sync.set({
    [sessionName]: newSesh
  });

  let elem = document.getElementById(elemId)
  let elem_parent = document.getElementById('edit-parent')
  elem_parent.removeChild(elem);

}

function createSession() {
  $('.selections').collapse('hide')
  groupMe.className = "grouper";

  let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

  toggleAll();
  let tab_urls = [];
  // console.log(checkboxes);
  console.log(checkboxes);
  for (let checkbox of checkboxes) {
    tab_urls.push({
      name: checkbox.parentElement.innerText,
      url: checkbox.childNodes[0].value
    })
  }

  let sessions_div = document.getElementById("sessions");
  let session = document.createElement("div");
  session.className = "session";
  session.id = `session-${count}`


  let input = document.createElement("input");
  input.className = "seshName";
  input.type = "text";
  input.setAttribute("placeholder", "Session Name")
  input.setAttribute("required", "required");
  session.appendChild(input);
  input.focus();

  let del = document.createElement("button");
  del.className = "del-button";
  let remover = document.createElement("i");
  remover.className = 'far fa-times-circle';
  del.appendChild(remover);
  del.onclick = () => {
    sessions_div.removeChild(session);
  }
  session.appendChild(del);

  sessions_div.appendChild(session);
  input.addEventListener('keyup', function (e) {
    if (input.value.length >= 1 && e.key === "Enter") {
      session.removeChild(input);
      chrome.storage.sync.set({
        [input.value]: tab_urls
      })
      createSessions(input.value);
    }
  })
}

/*set up the checkboxes to select tabs */
function selectTabs() {
  let selection_div = document.getElementById("loophole");
  let buttons_div = document.createElement("div");
  buttons_div.id = "buttons-div";

  let title = document.createElement('p');
  title.innerText = "Opened Tabs";
  selection_div.appendChild(title);

  let select_all = document.createElement("button");
  select_all.className = "btn select-all btn-secondary";
  select_all.id = "select-all"
  select_all.onclick = () => toggleAll();
  select_all.innerText = "Select All";
  buttons_div.appendChild(select_all);

  let create_button = document.createElement("button");
  create_button.innerText = "Create Session"
  create_button.className = "btn btn-success create-session"
  create_button.id = "create-button"
  create_button.style.visibility = "hidden"
  create_button.onclick = () => createSession()
  buttons_div.appendChild(create_button);

  selection_div.appendChild(buttons_div);

  let tabs_div = document.createElement("div");
  tabs_div.className = "tabs-div";

  chrome.tabs.query({
    currentWindow: true
  }, function (tabs) {
    tabs.forEach(tab => {
      let title = (tab.title.length > 20 ? tab.title.substring(0, 20) + "..." : tab.title);
      let container = document.createElement("label");
      container.className = "select_tab"
      let input = document.createElement("input");
      input.type = 'checkbox'
      container.innerText = title;
      let param = document.createElement("param");
      param.name = "tab-url"
      param.value = tab.url;
      input.appendChild(param);
      container.appendChild(input)
      tabs_div.appendChild(container);
    })
  })
  selection_div.appendChild(tabs_div);
}

/* toggle selected tabs on/off */
function toggleAll() {
  let selects = document.querySelectorAll('input[type="checkbox"]');
  if (document.querySelectorAll('input[type="checkbox"]:checked').length >= 1) {
    selected = true
  }
  selects.forEach(selection => {
    selection.checked = !selected;
  })
  selected = !selected;
  document.getElementById("create-button").style.visibility = (selected === true ? "visible" : "hidden")
  document.getElementById("select-all").className = (selected === true ? "btn btn-success" : "btn  btn-secondary")
  document.getElementById("select-all").innerText = (selected === true ? "Unselect All" : "Select All")
}

/* Remove session from storage and DOM */
function removeSession(sessionId, sessionName) {
  console.log(sessionId, sessionName);
  let session_div = document.getElementById("sessions")
  let result = window.confirm("Are you sure you want to remove this session?");
  if (result === true) {
    chrome.storage.sync.remove([sessionName], function () {
      session_div.removeChild(document.getElementById(sessionId));
    });
  }

}

/* Open a session when user clicks to open */
function openSession(sessionName) {
  let urls = []
  chrome.storage.sync.get([sessionName], function (data) {
    for (let i = 0; i < data[sessionName].length; i++) {
      urls.push(data[sessionName][i]['url'])
    }
    chrome.windows.create({
      url: urls
    })
  })
}

document.getElementById("selections").addEventListener("change", () => {
  if (document.querySelectorAll('input[type="checkbox"]:checked').length >= 1) {
    document.getElementById("select-all").className = "btn btn-success"
    document.getElementById("select-all").innerText = "Unselect All"
    let create_button = document.getElementById("create-button")
    create_button.style.visibility = "visible";
  }
})


/* When dom loads, create the dom elements needed */
$(document).on("DOMContentLoaded", function () {
  // chrome.storage.sync.clear(); //clear storage (FOR DEV ONLY)
  let groupMe = document.getElementById('groupMe');
  selectTabs();
  createSessions();

})


$(window).on("load", function () {

  $("#groupMe").on('click', function () {
    $(this).toggleClass("down")
  });

  setTimeout(function () {
    //show edit selections, stop dropdown from closing on click
    $('.accordion').on('click', 'a[data-toggle="collapse"]', function (event) {
      event.preventDefault();
      event.stopPropagation();
      $($(this).attr('href')).collapse('toggle');
    });

    //revert to default when dropdown opened
    $('.accordion').on('hide.bs.dropdown', function (event) {
      $('.remover').collapse('show');
      $('.opener').collapse('show');
      $('.edit-select-card').collapse("hide");
    });

    //prevent dropdown from closing when deleting tabs
    $('.accordion').on('click', '.del-tab', function (event) {
      console.log(event);
      // event.preventDefault();
      // event.stopPropagation();
    });

    $('.del-tab').on('click', function (e) {
      console.log(e);
    })

  }, 1000);

});

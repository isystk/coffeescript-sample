// Generated by CoffeeScript 1.4.0
var addLabel, createOperationMenu, escapeHTML, getSlideId, hideAll, labelDelete, labelLoad, labelSave, onDrag, operation, reEdit, showAll, slidesClass, socket;

socket = io.connect();

slidesClass = document.getElementsByClassName('slides')[0];

operation = document.getElementsByClassName('operation')[0];

socket.on('loaded', function(data) {
  labelLoad(data);
  return socket.json.emit('count up', {
    slideId: getSlideId()
  });
});

socket.on('counter', function(data) {
  var counter, slideId;
  counter = document.getElementsByClassName('counter')[0];
  slideId = getSlideId();
  if (slideId === data.slideId) {
    return counter.innerHTML = 'now reading : ' + data.count + ' people';
  }
});

socket.on('created', function(data) {
  var cancelButton, inputForm, inputText, newLabel, okButton, writeText;
  if (data.slideKey === getSlideId()) {
    newLabel = document.createElement('DIV');
    newLabel.id = data.id;
    newLabel.className = 'label';
    newLabel.style.left = data.x + 'px';
    newLabel.style.top = data.y + 'px';
    inputForm = document.createElement('FORM');
    inputText = document.createElement('TEXTAREA');
    inputText.style.cols = '10';
    inputText.style.rows = '3';
    inputForm.appendChild(inputText);
    okButton = document.createElement('INPUT');
    okButton.type = 'button';
    okButton.value = 'ok';
    okButton.onclick = function() {
      return writeText();
    };
    inputForm.appendChild(okButton);
    writeText = function() {
      var htmlstr, labelText, str;
      labelText = document.createElement('SPAN');
      str = inputText.value;
      str = escapeHTML(str);
      htmlstr = str.replace(/(\n|\r)+/g, '<br />');
      labelText.innerHTML = htmlstr;
      newLabel.appendChild(labelText);
      newLabel.removeChild(inputForm);
      console.log('currentSlideNo:%d', currentSlideNo);
      socket.json.emit('text edit', {
        id: newLabel.id,
        message: htmlstr
      });
      newLabel.onmousedown = function(evt) {
        return onDrag(evt, this);
      };
      newLabel.ondblclick = function(evt) {
        reEdit(evt, this);
        return false;
      };
      slidesClass.addEventListener('dblclick', addLabel, false);
      return document.addEventListener('keydown', handleBodyKeyDown, false);
    };
    cancelButton = document.createElement('INPUT');
    cancelButton.type = 'button';
    cancelButton.value = 'x';
    cancelButton.onclick = function() {
      var node;
      node = newLabel.parentNode;
      node.removeChild(newLabel);
      socket.json.emit('cancel', {
        id: newLabel.id
      });
      slidesClass.addEventListener('dblclick', addLabel, false);
      return document.addEventListener('keydown', handleBodyKeyDown, false);
    };
    inputForm.appendChild(cancelButton);
    newLabel.appendChild(inputForm);
    document.getElementsByClassName('slide')[data.slideno].appendChild(newLabel);
    return inputText.focus();
  }
});

socket.on('created by other', function(data) {
  var labelText, newLabel;
  if (data.slideKey === getSlideId()) {
    newLabel = document.createElement('DIV');
    newLabel.id = data.id;
    newLabel.className = 'label';
    newLabel.style.left = data.x + 'px';
    newLabel.style.top = data.y + 'px';
    labelText = document.createElement('SPAN');
    labelText.innerHTML = 'someone writing....';
    newLabel.appendChild(labelText);
    newLabel.onmousedown = function(evt) {
      return onDrag(evt, this);
    };
    newLabel.ondblclick = function(evt) {
      reEdit(evt, this);
      return false;
    };
  }
  slidesClass.addEventListener('dblclick', addLabel, false);
  document.addEventListener('keydown', handleBodyKeyDown, false);
  return document.getElementsByClassName('slide')[data.slideno].appendChild(newLabel);
});

socket.on('text edited', function(data) {
  var label, labelText, xButton, xButtonLabel;
  if (data.slideKey === getSlideId()) {
    label = document.getElementById(data.id);
    xButtonLabel = label.getElementsByTagName('A')[0];
    labelText = label.getElementsByTagName('SPAN')[0];
    if (xButtonLabel) {
      label.removeChild(xButtonLabel);
    }
    label.removeChild(labelText);
    xButton = document.createElement('A');
    xButton.href = '#';
    xButton.innerHTML = '[x]';
    xButton.onclick = function() {
      labelDelete(label.id);
      return false;
    };
    label.appendChild(xButton);
    labelText.innerHTML = data.message;
    return label.appendChild(labelText);
  }
});

socket.on('deleted', function(data) {
  var label, node;
  label = document.getElementById(data.id);
  node = label.parentNode;
  return node.removeChild(label);
});

socket.on('updated', function(data) {
  var label;
  label = document.getElementById(data.id);
  label.style.left = data.x + 'px';
  return label.style.top = data.y + 'px';
});

socket.on('cancelled', function(data) {
  var label, node;
  label = document.getElementById(data.id);
  node = label.parentNode;
  return node.removeChild(label);
});

window.onload = function() {
  var el, els, _i, _len;
  document.addEventListener('keydown', handleBodyKeyDown, false);
  els = slides;
  for (_i = 0, _len = els.length; _i < _len; _i++) {
    el = els[_i];
    addClass(el, 'slide');
  }
  updateSlideClasses();
  slidesClass.addEventListener('dblclick', addLabel, false);
  return createOperationMenu();
};

createOperationMenu = function() {
  var colorSelector, hideButton, nextButton, previousButton, redOption, showButton, yellowOption;
  showButton = document.createElement('BUTTON');
  showButton.type = 'button';
  showButton.innerHTML = 'show';
  showButton.onclick = function() {
    return showAll();
  };
  hideButton = document.createElement('BUTTON');
  hideButton.type = 'button';
  hideButton.innerHTML = 'hide';
  hideButton.onclick = function() {
    return hideAll();
  };
  previousButton = document.createElement('BUTTON');
  previousButton.type = 'button';
  previousButton.innerHTML = '< previous';
  previousButton.onclick = function() {
    return prevSlide();
  };
  nextButton = document.createElement('BUTTON');
  nextButton.type = 'button';
  nextButton.innerHTML = 'next >';
  nextButton.onclick = function() {
    return nextSlide();
  };
  colorSelector = document.createElement('SELECT');
  yellowOption = document.createElement('OPTION');
  yellowOption.value = 'yellow';
  yellowOption.innerHTML = 'yellow';
  yellowOption.onselect = function() {
    return console.log('yellow');
  };
  redOption = document.createElement('OPTION');
  redOption.value = 'red';
  redOption.innerHTML = 'red';
  colorSelector.appendChild(yellowOption);
  colorSelector.appendChild(redOption);
  operation.appendChild(showButton);
  operation.appendChild(hideButton);
  operation.appendChild(previousButton);
  return operation.appendChild(nextButton);
};

addLabel = function(event) {
  var layerX, layerY;
  slidesClass.removeEventListener('dblclick', addLabel, false);
  document.removeEventListener('keydown', handleBodyKeyDown, false);
  layerX = event.layerX;
  layerY = event.layerY;
  return socket.json.emit('create', {
    x: layerX,
    y: layerY,
    slideno: currentSlideNo - 1
  });
};

onDrag = function(evt, item) {
  var mousemove, mouseup, orgX, orgY, x, y;
  x = 0;
  y = 0;
  x = evt.screenX;
  y = evt.screenY;
  orgX = item.style.left;
  orgX = Number(orgX.slice(0, -2));
  orgY = item.style.top;
  orgY = Number(orgY.slice(0, -2));
  slidesClass.addEventListener('mousemove', mousemove, false);
  slidesClass.addEventListener('mouseup', mouseup, false);
  mousemove = function(move) {
    var dx, dy;
    dx = move.screenX - x;
    dy = move.screenY - y;
    item.style.left = (orgX + dx) + 'px';
    item.style.top = (orgY + dy) + 'px';
    return socket.json.emit('update', {
      id: item.id,
      x: orgX + dx,
      y: orgY + dy
    });
  };
  return mouseup = function() {
    return slidesClass.removeEventListener('mousemove', mousemove, false);
  };
};

reEdit = function(evt, oDiv) {
  var cancelButton, inputForm, inputText, okButton, str, writeText;
  str = oDiv.lastChild.innerHTML;
  str = escapeHTML(str);
  oDiv.removeChild(oDiv.firstChild);
  oDiv.removeChild(oDiv.firstChild);
  oDiv.ondblclick = function() {
    return {};
  };
  slidesClass.removeEventListener('dblclick', addLabel, false);
  oDiv.onmousedown = function() {
    return {};
  };
  inputForm = document.createElement('FORM');
  inputText = document.createElement('TEXTAREA');
  inputText.style.cols = '10';
  inputText.style.rows = '3';
  str = str.replace(/<br\b\/>|<br>/g, '\n');
  inputText.value = str;
  inputForm.appendChild(inputText);
  okButton = document.createElement('INPUT');
  okButton.type = 'button';
  okButton.value = 'ok';
  okButton.onclick = function() {
    return writeText();
  };
  inputForm.appendChild(okButton);
  writeText = function() {
    var labelText;
    labelText = document.createElement('SPAN');
    str = inputText.value;
    str = str.replace(/(\n|\r)+/g, '<br />');
    labelText.innerHTML = str;
    oDiv.appendChild(labelText);
    oDiv.removeChild(inputForm);
    socket.json.emit('text edit', {
      id: oDiv.id,
      message: str
    });
    oDiv.onmousedown = function(evt) {
      return onDrag(evt, this);
    };
    oDiv.ondblclick = function(evt) {
      reEdit(evt, this);
      return false;
    };
    slidesClass.addEventListener('dblclick', addLabel, false);
    return document.addEventListener('keydown', handleBodyKeyDown, false);
  };
  cancelButton = document.createElement('INPUT');
  cancelButton.type = 'button';
  cancelButton.value = 'x';
  cancelButton.onclick = function() {
    var labelText, xButton;
    xButton = document.createElement('A');
    xButton.href = '#';
    xButton.innerHTML = '[x]';
    xButton.onclick = function() {
      labelDelete(newLabel.id);
      return false;
    };
    oDiv.appendChild(xButton);
    labelText = document.createElement('SPAN');
    labelText.innerHTML = str;
    oDiv.appendChild(labelText);
    oDiv.removeChild(inputForm);
    oDiv.onmousedown = function(evt) {
      return onDrag(evt, this);
    };
    oDiv.ondblclick = function(evt) {
      reEdit(evt, this);
      return false;
    };
    slidesClass.addEventListener('dblclick', addLabel, false);
    return document.addEventListener('keydown', handleBodyKeyDown, false);
  };
  inputForm.appendChild(cancelButton);
  oDiv.appendChild(inputForm);
  return inputText.focus();
};

labelLoad = function(data) {
  var labelText, newLabel, xButton;
  newLabel = document.createElement('div');
  newLabel.className = 'label';
  newLabel.id = data._id;
  newLabel.style.left = data.x + 'px';
  newLabel.style.top = data.y + 'px';
  document.getElementsByClassName('slide')[data.slideno].appendChild(newLabel);
  xButton = document.createElement('A');
  xButton.href = '#';
  xButton.innerHTML = '[x]';
  xButton.onclick = function() {
    labelDelete(newLabel.id);
    return false;
  };
  newLabel.appendChild(xButton);
  labelText = document.createElement('span');
  labelText.innerHTML = data.message;
  newLabel.appendChild(labelText);
  newLabel.onmousedown = function(evt) {
    return onDrag(evt, this);
  };
  return newLabel.ondblclick = function(evt) {
    reEdit(evt, this);
    return false;
  };
};

getSlideId = function() {
  var end, slideId, start, url;
  url = location.href;
  start = url.lastIndexOf('/') + 1;
  end = url.indexOf('#');
  if (start < end) {
    slideId = url.substring(start, end);
    console.log(slideId);
    return slideId;
  } else {
    return 'default';
  }
};

escapeHTML = function(str) {
  return str.replace(/&/g, '&amp').replace(/'/g, '&quot').replace(/</g, '&lt').replace(/>/g, '&gt');
};

labelDelete = function(id) {
  return socket.json.emit('delete', {
    id: id
  });
};

labelSave = function() {};

showAll = function() {
  var label, labels, _i, _len, _results;
  labels = document.getElementsByClassName('label');
  console.log(labels);
  _results = [];
  for (_i = 0, _len = labels.length; _i < _len; _i++) {
    label = labels[_i];
    console.log(label);
    _results.push(label.style.display = '');
  }
  return _results;
};

hideAll = function() {
  var label, labels, _i, _len, _results;
  labels = document.getElementsByClassName('label');
  console.log(labels.length);
  _results = [];
  for (_i = 0, _len = labels.length; _i < _len; _i++) {
    label = labels[_i];
    console.log(label);
    _results.push(label.style.display = 'none');
  }
  return _results;
};

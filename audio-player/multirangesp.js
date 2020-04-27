function initMultirangeSliders(){
const multiRangeElements = document.getElementsByClassName('multirange');
const rangeSliderMaxValue = 100;
const rangeSliderMinValue = 0;
for (var i = 0; i < multiRangeElements.length; i++) {
    let _multiRangeElement = multiRangeElements[i];

    /* Initialize new multirange parent div properties */
    _multiRangeElement.highValue = rangeSliderMaxValue;
    _multiRangeElement.lowValue = rangeSliderMinValue;

    /* Since we only have two thumbs, we only get one high
     * and one low child element per slider */
    /*let lowValElement = _multiRangeElement.getElementsByClassName('multirange-low-val');
    let highValElement = _multiRangeElement.getElementsByClassName('multirange-high-val');*/
    _multiRangeElement.style.setProperty(`--w`, +_multiRangeElement.clientWidth+"px");

    /* Add event listeners */
    _multiRangeElement.addEventListener('input', e => {
      let _t = e.target;

      //BUG#1 In case values are undefined
      /*if (!_t.value){
        console.log(_t.childNodes); // 3 and 7
        _t.value=0;
        _t.parentNode.style.setProperty(`--lowValue`, 0);
        _t.parentNode.style.setProperty(`--highValue`, 100);
        if (_t.id==='lowVal'){
          _t.value = _multiRangeElement.lowValue;
        }else if (_t.id === 'highVal'){
          _t.value = _multiRangeElement.highValue;
        }
      }*/

      _multiRangeElement.style.setProperty(`--w`, +_multiRangeElement.clientWidth+"px");
      /*_t.parentNode.style.setProperty(`--${_t.id}`, +_t.value);*/
      console.log("\n::sliders:ID:"+_multiRangeElement.id+":--w:"+_multiRangeElement.clientWidth+"px"+":_sliderID:"+_t.id+":value:"+_t.value)
      if (_t.id==='lowVal' | _t.id==='lowValB'){
        //BUG#1
        console.log("HERE!\n")
        if (!_t.value){
          console.log("and here");
          console.log(_t.childNodes); // 3 and 7
          _t.value=rangeSliderMinValue;
        }



        /** TODO: **/
        if (_multiRangeElement.highValue <= parseInt(_t.value)){
          _t.value = parseInt(_multiRangeElement.highValue) - 1;
          _t.parentNode.style.setProperty(`--${_t.id}`, +_t.value);
        } else {
          _t.parentNode.style.setProperty(`--${_t.id}`, +_t.value);
        }
       _multiRangeElement.lowValue =_t.value;
    }
      else if (_t.id==='highVal' | _t.id==='highValB'){
        //BUG#1
        console.log("HERE!!!\n")
        if (!_t.value){
          console.log(_t.childNodes); // 3 and 7
          _t.value=rangeSliderMinValue;
        }

        /** TODO: **/
        if (_multiRangeElement.lowValue >= parseInt(_t.value)){
          _t.value = (parseInt(_multiRangeElement.lowValue) + 1);
          _t.parentNode.style.setProperty(`--${_t.id}`, +_t.value);
        } else {
          _t.parentNode.style.setProperty(`--${_t.id}`, +_t.value);
        }
       _multiRangeElement.highValue =_t.value;
    }
    //set new rangeSlider



    //showVals();
    }, false);

}
} // function initMultirangeSliders

/*
function showVals(){
  document.getElementById('property_one').innerHTML="Slider <font color=\"lightblue\">1</font> is now at >> low:"+document.getElementById('slider1').lowValue+"::high:"+document.getElementById('slider1').highValue;
  document.getElementById('property_two').innerHTML="Slider <font color=\"#55a4aa\">2</font> is now at >> low:"+document.getElementById('slider2').lowValue+"::high:"+document.getElementById('slider2').highValue;
}*/

initMultirangeSliders()
//showVals()

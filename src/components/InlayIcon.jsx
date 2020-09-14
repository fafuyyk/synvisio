import React from 'react';

export default ({ top = '20', right = '30', fontSize = '25', type = 'primary', icon = 'cycle', onClick }) => {

    const iconStyle = {
        'position': 'absolute',
        'top': top + 'px',
        'right': right + 'px',
        'fontSize': fontSize + 'px'
    }

    let hexCode = <span className='synvisio-icon m-r-0'>&#x21ba;</span>

    if (icon == 'arrow-right') {
        hexCode = <span className='synvisio-icon m-r-0'>&#x21a6;</span>
    }
    else if (icon == 'arrow-left') {
        hexCode = <span className='synvisio-icon m-r-0'>&#x21a4;</span>
    }
    else if (icon == 'shuffle') {
        hexCode = <span className='synvisio-icon m-r-0'>&#x21b9;</span>
    }

    return (
        <button style={iconStyle} className={"inlay-icon btn btn-" + type + "-outline"} onClick={onClick}>
           {hexCode}
        </button>);

}

import './Grid.css';

export default function Row({row_no,selected}){
    var cells = [];
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(var i = 0; i < 26; i++){
        cells.push(<td id={alphabet[i]+row_no} className={alphabet[i]+row_no === selected ? 'selected-cell': 'cell'}></td>)
    }
    return(
    <tr id={row_no}>
        <th id={'r'+row_no} className='row-ruler'>{row_no}</th>
        {cells}
    </tr>
    )
};
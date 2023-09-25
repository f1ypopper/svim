import './Grid.css';

export default function Row({row_no}){
    var cells = [];
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(var i = 0; i < 26; i++){
        cells.push(<td id={alphabet[i]+row_no} className='cell'></td>)
    }
    return(
    <tr id={row_no}>
        <th id={'r'+row_no} className='row-ruler'>{row_no}</th>
        {cells}
    </tr>
    )
};
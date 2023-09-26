import Row from './row.js';
import './Grid.css';
export default function Grid({selected}){
    var column_ruler = [<th></th>];
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(var i = 0; i < 26; i++){
        column_ruler.push(<th className='cell'>{alphabet[i]}</th>)
    }
    var rows = [];
    for(var i = 0; i < 100; i++){
        rows.push(<Row row_no={i} selected={selected}></Row>)
    }
    return (
    <table className='gridtable'>
        <tr>
            {column_ruler}
        </tr>
        {rows}
    </table>);
};
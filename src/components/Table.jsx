import { useState } from "react";
import { clone } from "../utils/helpers";
import './table.css';
import PropTypes from "prop-types";

function Table({ headers, initdata }) {
    const [data, setdata] = useState(
        // concat a record id for keyword searching
        clone(initdata).map((row, idx) => row.concat(idx)),
    );
    const [sort, setsort] = useState({ col: null, desc: false });
    const [edit,setedit]=useState(null);
    const [search,setsearch]=useState(false);
    const [presearchdata,setpresearchdata]=useState(null);

    // sort table by click
    const onSort = (e) => {
        const col = e.target.cellIndex;
        const desc = sort.col === col && !sort.desc;
        const dataclone = clone(data);
        dataclone.sort((a, b) => {
            if (a[col] === b[col]) return 0;
            return desc ? (
                a[col] < b[col] ? 1 : -1
            ) : (
                a[col] > b[col] ? 1 : -1
            )
        });
        setdata(dataclone);
        setsort({ col, desc });
    }
    // edit table
    const onEdit=(e)=>{
        setedit({
            row:parseInt(e.target.parentNode.dataset.row,10),
            col:e.target.cellIndex,
        });
    }
    const onSaveEdit=(e)=>{
        e.preventDefault();
        const input=e.target.firstChild;
        const dataclone=clone(data).map((row)=>{
            if(row[row.length-1]===edit.row){
                row[edit.col]=input.value;
            }
            return row;
        });
        dataclone[edit.row][edit.col]=input.value;
        setdata(dataclone);
        setedit(null);
        // const presearch=clone(presearchdata);
        // presearch[edit.row][edit.col]=input.value;
        // setpresearchdata(presearch);
    }

    // search table
    const toggleSearch=()=>{
        if(search){
            setdata(presearchdata);
            setsearch(false);
            setpresearchdata(null);
        }else{
            setpresearchdata(data);
            setsearch(true);
        }
    }
    const onSearch=(e)=>{
        const keyword=e.target.value.toLowerCase();
        if(!keyword){
            setdata(presearchdata);
            return;
        }
        const idx=e.target.dataset.idx;
        const searchdata=presearchdata.filter((row)=>{
            return row[idx].toString().toLowerCase().indexOf(keyword)>-1;
        });
        setdata(searchdata);
    }
    const searchboxes=!search?null:(
        <tr onChange={onSearch}>
            {headers.map((_,idx)=>(
                <td key={idx}>
                    <input type="text" data-idx={idx}/>
                </td>
            ))}
        </tr>
    );
    return (
        <div>
            <div>
                <button onClick={toggleSearch}>
                    {search?'Hide Search':'Show Search'}
                </button>
            </div>

            <table>
                <thead onClick={onSort}>
                    <tr>
                        {headers.map((header, idx) => {
                            if(sort.col===idx) header+=sort.desc?'\u2191':'\u2193';
                            return <th key={idx}>{header}</th>
                        })
                        }
                    </tr>
                </thead>
                <tbody onDoubleClick={onEdit}>
                    {searchboxes}
                    {data.map((row,rowidx)=>(
                        <tr key={rowidx} data-row={rowidx}>
                            {row.map((cell,colidx)=>{
                                if(edit&&edit.row===rowidx&&edit.col===colidx){
                                    cell=(
                                        <form onSubmit={onSaveEdit}>
                                            <input type="text" defaultValue={cell}/>
                                        </form>
                                    );
                                }
                                return <td key={colidx}>{cell}</td>
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
Table.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string),
    initdata: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
}
export default Table;
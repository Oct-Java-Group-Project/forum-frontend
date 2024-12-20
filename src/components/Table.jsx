import { useEffect, useState } from "react";
import { clone, parsedate } from "../utils/helpers";
import './table.css';
// import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import Dialog from "./Dialog";
import { createPost, fetchPostDetails, updatePost } from "../services/postService";
import { updateUser } from "../services/userService";
import { createHistory } from "../services/historyService";

function Table({ headers, initdata, activetab }) {
    const { authstate } = useAuth();
    // for conditional rendering of detail page
    const location = useLocation();

    const [data, setdata] = useState([]);
    // for sorting, editing data
    const [sort, setsort] = useState({ col: null, desc: false });
    const [edit, setedit] = useState(null);
    // for filtering data
    const [search, setsearch] = useState(false);
    const [presearchdata, setpresearchdata] = useState(null);
    // for post detail dialog box
    const [dialog, setdialog] = useState(false);
    const [post, setpost] = useState([]);
    // for new post dialog box
    const [newdialog, setnewdialog] = useState(false);
    const [newpost, setnewpost] = useState([]);

    const onSort = (e) => {
        const col = e.target.cellIndex + 1;
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

    useEffect(() => {
        if (!Array.isArray(initdata)) {
            console.warn('Warning: initdata is not an array:', initdata);
            setdata([]);
            return;
        }

        try {
            const processedData = clone(initdata).map((row, idx) => {
                if (!Array.isArray(row)) {
                    console.warn('Warning: Row is not an array:', row);
                    return Array(headers.length - 1).fill('').concat([idx]);
                }
                return row.concat(idx);
            });

            // console.log('Processed table data:', processedData);
            setdata(processedData);
        } catch (error) {
            console.error('Error processing table data:', error);
            setdata([]);
        }
    }, [initdata]);

    // edit table
    const onEdit = (e) => {
        setedit({
            row: parseInt(e.target.parentNode.dataset.row, 10),
            col: e.target.cellIndex + 1,
        });
    }
    const onSaveEdit = (e) => {
        e.preventDefault();
        const input = e.target.firstChild;

        if (location.pathname === '/home') {
            persistPostEdit(input);
        } else if (location.pathname == '/users') {
            persistUserEdit(input);
        }

    }
    const persistUserEdit = async (input) => {
        const userid = data[edit.row][0];
        let updatedata = {
            // firstname, lastname, email, createdAt, type, active
            firstName: edit.col === 1 ? input.value : data[edit.row][1],
            lastName: edit.col === 2 ? input.value : data[edit.row][2],
            email: edit.col === 3 ? input.value : data[edit.row][3],
            createdAt: parsedate(edit.col === 4 ? input.value : data[edit.row][4]),
            type: edit.col === 5 ? input.value : data[edit.row][5],
            active: edit.col === 6 ? input.value : data[edit.row][6],
        };

        try {
            updateUser(userid, updatedata);
            updateUIAfterEdit(input);
        } catch {
            console.log('could not update user...');
        }
    };
    const persistPostEdit = async (input) => {
        // api put call 
        const postid = data[edit.row][0];
        let updateddata = {};
        if (activetab === 'All') {
            updateddata = {
                title: edit.col === 1 ? input.value : data[edit.row][1],
                userId: edit.col === 2 ? input.value : data[edit.row][2],
                createdAt: parsedate(edit.col === 3 ? input.value : data[edit.row][3]),
                accessibility: (edit.col === 4 ? input.value : data[edit.row][4]).toUpperCase(),
            };
        } else if (activetab === 'Deleted') {
            updateddata = {
                title: edit.col === 1 ? input.value : data[edit.row][1],
                userId: edit.col === 2 ? input.value : data[edit.row][2],
                createdAt: parsedate(edit.col === 3 ? input.value : data[edit.row][3]),
            };
        }
        try {
            await updatePost(postid, updateddata);
            updateUIAfterEdit(input);
        } catch {
            console.log('could not update post...');
        };
    }
    const updateUIAfterEdit = (input) => {
        const dataclone = clone(data).map((row) => {
            if (row[row.length - 1] === edit.row) {
                row[edit.col] = input.value;
            }
            return row;
        });
        if (!search) {
            dataclone[edit.row][edit.col] = input.value;
        } else {
            const presearch = clone(presearchdata);
            presearch[edit.row][edit.col] = input.value;
            setpresearchdata(presearch);
        }
        setdata(dataclone);
        setedit(null);
    };
    // search table
    const toggleSearch = () => {
        console.log(initdata);
        if (search) {
            setdata(presearchdata);
            setsearch(false);
            setpresearchdata(null);
        } else {
            setpresearchdata(data);
            setsearch(true);
        }
    }
    const onSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        if (!keyword) {
            setdata(presearchdata);
            return;
        }
        const idx = e.target.dataset.idx;
        const searchdata = presearchdata.filter((row) => {
            return row.some((cell, colindex) => {
                if (colindex === parseInt(idx, 10)) {
                    return cell.toString().toLowerCase().includes(keyword);
                }
                return false;
            });
            // return row[idx].toString().toLowerCase().indexOf(keyword)>-1;
        });
        setdata(searchdata);
    }
    const searchboxes = !search ? null : (
        <tr onChange={onSearch}>
            {headers.map((_, idx) => {
                if (idx === 0) return;
                return <td key={idx}>
                    <input type="text" data-idx={idx} placeholder={`Search ${headers.length > 4 ? '' : headers[idx]}`} className={headers.length > 4 ? 'searchbox' : ''} />
                </td>
            })}
        </tr>
    );

    // display post details with dialog box
    const onPost = async (id) => {
        try {
            const postdetails = await fetchPostDetails(id);
            setpost(postdetails);
            setdialog(true);

            if (postdetails && authstate.user) {
                createHistory(authstate.user.userid, id).catch(historyErr => {
                    console.error('Failed to create history:', historyErr);
                });
            }
        } catch (err) {
            console.error('Error fetching post details:', err);
        }
    };
    const onNewPost = async (newpostdata) => {
        try {
            
            setnewpost({
                title: newpostdata.title,
                userId: authstate.user.userid,
                createdAt: new Date(),
                accessibility: newpostdata.accessibility,
            });
            setnewdialog(false);
            await createPost(newpost);

        } catch (err) {
            console.log('could not create post...');
        }

    };
    return (
        <div className="tile">
            <div className="buttons">
                <p className="button" onClick={toggleSearch}>
                    {search ? 'Hide Search' : 'Show Search'}
                </p>
                {!authstate.user.isadmin && location.pathname === '/home' &&
                    <>
                        <p id="addpost" onClick={()=>setnewdialog(true)}>+</p>
                        {
                        <Dialog isvisible={newdialog} onClose={() => setnewdialog(false)} postdetails={newpost} isnewpost={true} onPostSubmit={onNewPost}/>
                        }
                    </>
                }

            </div>

            <table>
                <thead onClick={onSort}>
                    <tr>
                        {headers.map((header, idx) => {
                            if (idx === 0) return;
                            if (sort.col === idx) {
                                header += sort.desc ? '\u2191' : '\u2193';
                            }
                            return <th key={idx} className={sort.col === idx ? 'accent' : null}>{header}</th>
                        })
                        }
                    </tr>
                </thead>
                <tbody onDoubleClick={authstate.user.isadmin ? onEdit : null} >
                    {searchboxes}

                    {data.map((row) => {
                        // record index, not really row index
                        const rowidx = row[row.length - 1];
                        return (
                            <tr key={rowidx} data-row={rowidx}>
                                {row.map((cell, colidx) => {
                                    if (colidx === 0 || colidx === headers.length) return;

                                    if (edit && edit.row === rowidx && edit.col === colidx) {
                                        cell = (
                                            <form onSubmit={onSaveEdit}>
                                                <input type="text" defaultValue={cell} list={`${rowidx}-${colidx}`} />


                                            </form>
                                        );
                                    }
                                    if (colidx === 1 && (location.pathname === '/home' || location.pathname === '/history')) {
                                        return <td key={colidx} className="postdetails" onClick={() => onPost(row[0])}>{cell}</td>
                                    }
                                    return <td key={colidx} className={cell === 'Published' || cell === 'Active' ? 'green' : cell === 'Deleted' || cell === 'Inactive' ? 'red' : cell === 'Admin' || cell === 'Superadmin' ? 'accent' : ''}>{cell}</td>
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Dialog isvisible={dialog} onClose={() => setdialog(false)} postdetails={post} isnewpost={false}/>
        </div>
    );
}

// Table.propTypes = {
//     headers: PropTypes.arrayOf(PropTypes.string),
//     initdata: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
// }
export default Table;
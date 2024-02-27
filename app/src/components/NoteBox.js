import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {handleSessionExpired} from "../utility/SessionExpiryHandler";

export default function NoteBox({apiUrl}) {


    const ITEMS_PER_PAGE = "4"; //4 notes are fetched per page
    const [accessToken] = useState(localStorage.getItem('accessToken') || '');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sidebarData, setSidebarData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [noteContent, setNoteContent] = useState(localStorage.getItem("noteContent") || '');
    const [editMode, setEditMode] = useState(JSON.parse(localStorage.getItem("editMode") || "false"));
    const toggleButtonContent = isSidebarOpen ? 'X' : 'Get saved notes';
    const [currentNoteId, setCurrentNoteId] = useState(
        JSON.parse(localStorage.getItem("currentNoteId")) || null
    );
    //for pagiation
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const displayButton = editMode ? 'Save Changes' : 'Save';
    const navigate = useNavigate();


    useEffect(() => {
        localStorage.setItem("noteContent", noteContent);
    }, [noteContent]);


    useEffect(() => {
        // Save editMode to localStorage as a string
        localStorage.setItem("editMode", JSON.stringify(editMode));
    }, [editMode]);


    useEffect(() => {
        localStorage.setItem("currentNoteId", JSON.stringify(currentNoteId));
    }, [currentNoteId]);


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(apiUrl + "/note", {
                content: noteContent
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setNoteContent("");
            if (response.status === 200 && isSidebarOpen) {
                await fetchData(currentPage);
            }

        } catch (err) {
            if (!err?.response) {
                console.log("No Server Response");
            } else if (err?.response.status === 401) {
                console.log("Error message: ", err.response.data);
                handleSessionExpired(navigate); // Handle session expiry
            } else if (err?.response.status === 403) {
                console.log("Bad request");
            } else {
                console.log("Failed to access source")
            }

        }
    }


    const editSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(apiUrl + "/note/api/" + currentNoteId, noteContent, {
                headers: {
                    'Content-Type': 'text/plain',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setNoteContent("");
            setEditMode(false);
            if (response.status === 200) {
                await fetchData(currentPage);
            }
        } catch (err) {
            if (!err?.response) {
                console.log("No Server Response");
            } else if (err?.response.status === 401) {
                console.log("Error message: ", err.response.data);
                handleSessionExpired(navigate); // Handle session expiry
            } else if (err?.response.status === 403) {
                console.log("Bad request");
            } else {
                console.log("Failed to access source")
            }

        }

    }

    const fetchData = async (pageNumber = 1) => {
        const pageNum = pageNumber - 1;
        setIsLoading(true);
        try {
            const response = await axios.get(apiUrl + "/note", {
                params: {
                    page: pageNum,
                    size: ITEMS_PER_PAGE
                },
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setSidebarData(response.data?.notes);
            setTotalPages(response.data?.totalPages);
            setCurrentPage(response.data?.currentPage + 1);
            setIsLoading(false);
        } catch (error) {
            if (error?.response.status === 401) {
                console.log("Error message: ", error.response.data);
                handleSessionExpired(navigate); // Handle session expiry
            } else {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            }
        }
    };


    //upon page load get the auth token
    useEffect(() => {
        localStorage.setItem('accessToken', accessToken);
    }, [accessToken]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        if (!isSidebarOpen) {
            setCurrentPage(1);
            fetchData().then(() => {
                console.log("Data fetched successfully after toggling sidebar.");
            }).catch(error => {
                console.error("Error fetching data:", error);
            });
        }
    };


    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchData(pageNumber).then(() => {
            console.log("Data fetched successfully for page:", pageNumber);
        }).catch(error => {
            console.error("Error fetching data for page:", pageNumber, error);
        });
    };


    const deleteRequest = async (noteId, event) => {
        let answer = window.confirm("Are you sure you want to delete the note?")
        if (answer) {
            event.preventDefault();
            try {
                const response = await axios.delete(apiUrl + "/note/" + noteId, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                });
                if (response.status === 200) {
                    await fetchData(currentPage);
                }
            } catch (err) {
                if (!err?.response) {
                    console.log("No Server Response");
                } else if (err?.response.status === 404) {
                    console.log("Error message: ", err.response.data);
                    handleSessionExpired(navigate); // Handle session expiry
                } else if (err?.response.status === 403) {
                    console.log("Bad request");
                } else {
                    console.log("Failed to access source")
                }

            }
        }

    };


    // Pagination Component
    const Pagination = ({totalPages, currentPage}) => {
        const maxPageNumbersToShow = 3;
        const pages = [];
        // calculate the range of page numbers to show
        let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

        // adjust the start page  at the end of the range
        if (endPage === totalPages) {
            startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
        }

        // previous page link
        pages.push(
            <button key="prev" className="buttonPag" onClick={() =>
                handlePageClick(currentPage - 1)} disabled={currentPage === 1}>
                Previous
            </button>
        );

        // first page link
        if (startPage > 1) {
            pages.push(
                <a href="#" key={1} onClick={(e) => {
                    e.preventDefault();
                    handlePageClick(1);
                }}>
                    1
                </a>
            );
            if (startPage > 2) pages.push(<span key="startEllipsis">...</span>);
        }

        // page number links
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <a
                    href="#"
                    key={i}
                    className={`pagination-link ${i === currentPage ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        handlePageClick(i);
                    }}
                    aria-current={i === currentPage ? 'page' : undefined}
                    aria-disabled={i === currentPage ? 'true' : 'false'}
                >
                    {i}
                </a>
            );
        }

        // last page link
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push(<span key="endEllipsis">...</span>);
            pages.push(
                <a href="#" key={totalPages} onClick={(e) => {
                    e.preventDefault();
                    handlePageClick(totalPages);
                }}>
                    {totalPages}
                </a>
            );
        }

        // next page link
        pages.push(
            <button key="next" className="buttonPag" onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}>
                Next
            </button>
        );

        return <div className="pagination-container">{pages}</div>;
    };


    return (
        <div className="container-note">
            <div className='note-input-container'>
                <h1 id="titleNote">{editMode ? 'Your Note' : 'Write your note here'}</h1>
                <form onSubmit={editMode ? editSubmit : handleSubmit} className="note-form">
                    <label htmlFor="noteContent"></label>
                    <textarea id="noteContent" name="noteContent" rows="10" cols="50"
                              className="input-box-note" value={noteContent}
                              onChange={(e) => setNoteContent(e.target.value)}/>
                    <div className="note-buttons">
                        <button className="note-save" type="submit">{displayButton}</button>
                        {editMode && (
                            <button className="discard-save" onClick={() => {
                                setEditMode(false);
                                setNoteContent('')
                            }}>Done Viewing</button>
                        )}
                    </div>
                </form>
            </div>
            <div className="allSideBar">
                <button className={`sideBar-button ${toggleButtonContent}`}
                        onClick={toggleSidebar}>{toggleButtonContent}</button>
                {isSidebarOpen && (
                    <div className="sidebar">
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            <>

                                <Pagination totalPages={totalPages} currentPage={currentPage}/>

                                <div className="notes-container">
                                    {sidebarData && sidebarData.map((note, index) => (
                                        <div className="note-item" key={index}>
                                            <div className="note-date">{note.date}</div>
                                            <div className="note-content">{note.content}</div>
                                            <a href="#" className="edit" onClick={() => {
                                                setNoteContent(note.content);
                                                setCurrentNoteId(note.id);
                                                setEditMode(true);
                                            }}>View</a>
                                            <a href="#" className="delete" onClick={(e) =>
                                                deleteRequest(note.id, e)}>Delete</a>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )


}
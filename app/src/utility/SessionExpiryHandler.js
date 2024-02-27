export const handleSessionExpired = (navigate) => {
    // localStorage keys to remove
    const localStorageKeys = [
        'token',
        'editMode',
        'noteContent',
        'currentNoteId'
    ];

    localStorageKeys.forEach(key => localStorage.removeItem(key));

    alert("Your session has expired. Please log in again.");

    navigate("/login");
};

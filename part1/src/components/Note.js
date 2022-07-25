const Note = ({ note, toggleImportant }) => {
  const label = note.important ? "make not important" : "make important";
  return (
    <li class="p-1 bg-gray-200 text-l">
      {note.content}
      <button
        class="bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded-full mx-2"
        onClick={toggleImportant}
      >
        {label}
      </button>
    </li>
  );
};

export default Note;

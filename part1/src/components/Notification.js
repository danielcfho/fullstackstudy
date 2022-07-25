const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return (
    <div
      class="flex text-lg font-bold border text-red-500 bg-gray-100 rounded p-5 mb-5 "
    >
      {message}
    </div>
  );
};

export default Notification;

import { toast } from 'react-toastify';

function Toastify({ type, message }) {
  const options = {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 3000,
    theme: 'colored',
    type: type.toLowerCase(),
  };

  toast(message, options);
}

export default Toastify;

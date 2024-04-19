import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Toastify(prop) {
  const position = toast.POSITION.TOP_CENTER;
  const autoClose = 3000;
  const theme = 'colored';

  const renderSwitch = param => {
    switch (param.toLowerCase()) {
      case 'info':
        return toast.info(prop.message, {
          position: position,
          autoClose: autoClose,
          theme: theme,
        });
      case 'success':
        return toast.success(prop.message, {
          position: position,
          autoClose: autoClose,
          theme: theme,
        });
      case 'warn':
        return toast.warn(prop.message, {
          position: position,
          autoClose: autoClose,
          theme: theme,
        });
      default:
        return toast.error(prop.message, {
          position: position,
          autoClose: autoClose,
          theme: theme,
        });
    }
  };

  return <div>{renderSwitch(prop.type)}</div>;
}

export default Toastify;

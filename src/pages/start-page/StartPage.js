import { config } from '../../config/Constants';
import { FormattedMessage } from 'react-intl';

const Start = () => {
  var url = config.url.API_URL;
  console.log(url);
  return (
    <>
      <FormattedMessage id="startText" />
    </>
  );
};
export default Start;

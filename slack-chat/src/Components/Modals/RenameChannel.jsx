import { useEffect, useRef, useState } from 'react';
import {
  FormControl, FormGroup, FormLabel, Button, Modal,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { selectors as channelSelectors } from '../../slices/channelsSlice';
import socket from '../../socket';
import toast from '../../toast';
import { getChannelNameSchema } from '../../yup';

const RenameChannel = (props) => {
  const [disabled, setDisable] = useState(false);
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const { onHide, modalInfo } = props;
  const { id, name } = modalInfo.item;
  const channelsNames = useSelector(channelSelectors.selectAll).map((channel) => channel.name);

  const NameSchema = getChannelNameSchema(channelsNames);

  const formik = useFormik({
    initialValues: { body: name },
    onSubmit: (values) => {
      setDisable(true);
      socket.emit('renameChannel', { id, name: values.body }, (response) => {
        const { status } = response;
        if (status === 'ok') {
          setDisable(false);
          onHide();
          return toast('success', 'renameChannel');
        }
        return setDisable(false);
      });
    },
    validationSchema: NameSchema,
    validateOnChange: false,
    validateOnBlur: false,
  });

  useEffect(() => {
    setTimeout(() => {
      inputRef.current.focus();
      inputRef.current.select();
    });
  }, []);

  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={() => onHide()}>
        <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
      </Modal.Header>
      <form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <FormGroup>
            <FormControl
              required
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.body}
              id="body"
              name="body"
              isInvalid={!!formik.errors.body}
            />
            <FormLabel className="visually-hidden" htmlFor="body">{t('modals.channelName')}</FormLabel>
            <FormControl.Feedback type="invalid">{formik.errors.body}</FormControl.Feedback>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" disabled={disabled} onClick={() => onHide()}>
            {t('buttons.cancel')}
          </Button>
          <Button variant="primary" type="submit" disabled={disabled}>
            {t('buttons.send')}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default RenameChannel;

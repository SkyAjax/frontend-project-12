import { useEffect, useRef, useState } from 'react';
import {
  FormControl, FormGroup, Button, Modal, FormLabel,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { selectors as channelSelectors, actions as channelActions } from '../../slices/channelsSlice';
import { useApi } from '../../hooks/index';

const AddChannel = (props) => {
  const [disabled, setDisable] = useState(false);
  const { onHide } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const api = useApi();

  const channelsNames = useSelector(channelSelectors.selectAll).map((channel) => channel.name);

  const NameSchema = Yup.object().shape({
    body: Yup.string()
      .min(3)
      .max(20, t('errors.fieldTooShort.symbol', { count: 20 }))
      .required()
      .notOneOf(channelsNames),
  });

  const formik = useFormik({
    initialValues: { body: '' },
    onSubmit: (values) => {
      setDisable(true);
      api.newChannel({ name: values.body }, (response) => {
        const { data, status } = response;
        if (status === 'ok') {
          dispatch(channelActions.setActiveChannel(data));
          setDisable(false);
          onHide();
          return toast.success(t('toast.success.addChannel'));
        }
        return setDisable(false);
      });
    },
    validationSchema: NameSchema,
    validateOnChange: false,
    validateOnBlur: true,
    validateOnMount: false,
  });
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={() => onHide()}>
        <Modal.Title>{t('modals.addChannel')}</Modal.Title>
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
            <FormControl.Feedback type="invalid">{t(formik.errors.body)}</FormControl.Feedback>
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

export default AddChannel;

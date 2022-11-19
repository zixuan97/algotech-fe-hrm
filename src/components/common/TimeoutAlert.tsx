import { Alert } from 'antd';
import * as React from 'react';
import { useLocation } from 'react-router';

export interface AxiosErrDataBody {
  message: string;
}

export interface AlertType {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  description?: string;
}

type AlertProps = {
  alert: AlertType | null;
  clearAlert: () => void;
  closable?: boolean;
  timeout?: number;
  className?: string;
  style?: React.CSSProperties;
};

const TimeoutAlert = ({
  alert,
  clearAlert,
  closable = true,
  timeout = 3000,
  className = '',
  style = {}
}: AlertProps) => {
  const location = useLocation();

  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout>();

  React.useEffect(() => {
    if (alert) {
      setTimeoutId(
        setTimeout(() => {
          clearAlert();
        }, timeout)
      );
    }
  }, [alert, clearAlert, timeout]);

  // clear timeout on component unmount
  React.useEffect(() => () => clearTimeout(timeoutId), [location, timeoutId]);

  if (!alert) return null;

  const { type, message, description } = alert;

  return (
    <Alert
      type={type}
      message={message}
      description={description}
      onClose={clearAlert}
      showIcon
      closable={closable}
      className={className}
      style={style}
    />
  );
};

export default TimeoutAlert;

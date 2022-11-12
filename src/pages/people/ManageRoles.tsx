import React, { useState } from 'react';
import { Button, Divider, Form, Popconfirm, Table, Typography } from 'antd';
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined
} from '@ant-design/icons';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import ConfirmationModalButton from 'src/components/common/ConfirmationModalButton';

const ManageRoles = () => {
  return <p>manage roles</p>;
};

export default ManageRoles;

import { MoreOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon: React.ReactNode | null,
  children: MenuItem[] | null,
  onClick?: () => void
): MenuItem {
  return {
    label,
    key,
    icon,
    children,
    onClick
  } as MenuItem;
}

interface props {
  setEdit: () => void;
  setOpenModal: () => void;
}

const AccountMenu = ({ setEdit, setOpenModal }: props) => {
  const menuItems: MenuProps['items'] = [
    getItem('Actions', 'actions', <MoreOutlined />, [
      getItem('Update Information', 'update_information', null, null, setEdit),
      getItem('Change Password', 'change_password', null, null, setOpenModal)
    ])
  ];

  return <Menu mode='horizontal' items={menuItems} />;
};

export default AccountMenu;

import { Avatar, type AvatarProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { user } from "../../utils/index.utils.ts";

export function UserAvatar({ ...rest }: AvatarProps) {
  return (
    <Avatar
      {...rest}
      icon={<UserOutlined />}
      src={user.avatarUrl ? user.avatarUrl : undefined}
    />
  );
}

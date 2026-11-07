import { Avatar, type AvatarProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { IUser } from "../../constants/interfaces/user.interfaces.ts";
import { useCurrentUser } from "../../hooks/useCurrentUser.ts";

interface UserAvatarProps extends AvatarProps {
  /** Whose avatar to show; defaults to the logged-in user. */
  user?: IUser;
}

export function UserAvatar({ user, ...rest }: UserAvatarProps) {
  const { user: currentUser } = useCurrentUser();
  const shownUser = user ?? currentUser;

  return (
    <Avatar
      {...rest}
      icon={<UserOutlined />}
      src={shownUser?.avatarUrl ?? undefined}
    />
  );
}

import { useOthers, useSelf } from "@liveblocks/react/suspense";
import styles from "./Avatar.module.css"; // Ensure the correct path

export function Avatars() {
  const users = useOthers();
  const currentUser = useSelf();

  return (
    <div className={styles.avatars}>
      {users.map(({ connectionId, info }) =>
        info && typeof info.avatar === "string" && typeof info.name === "string" ? (
          <Avatar key={connectionId} picture={info.avatar} name={info.name} />
        ) : null
      )}

      {currentUser?.info && typeof currentUser.info.avatar === "string" && typeof currentUser.info.name === "string" && (
        <div className="relative ml-8 first:ml-0">
          <Avatar picture={currentUser.info.avatar} name={currentUser.info.name} />
        </div>
      )}
    </div>
  );
}

export function Avatar({ picture, name }: { picture: string; name: string }) {
  return (
    <div className={styles.avatar} data-tooltip={name}>
      <img src={picture} className={styles.avatar_picture} alt={name} />
    </div>
  );
}

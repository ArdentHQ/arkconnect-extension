import {useProfileContext} from "@/lib/context/Profile";
import {useRef} from "react";

export const useHaveWalletsCallback = (callback: () => void) => {
    const { profile } = useProfileContext();

    const walletsCount= useRef(profile.wallets().count()).current;

    return () => {
        if (walletsCount > 0) {
            callback();
        }
    }
}

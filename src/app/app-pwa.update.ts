import { SwUpdate } from "@angular/service-worker";

export const pwaUpdate = (window: Window, swUpdate: SwUpdate): (() => Promise<any>) => {
  return (): Promise<void> =>
    new Promise((resolve) => {
      if (swUpdate.isEnabled) {
        swUpdate.checkForUpdate()
          .then(new_version => {
            if (new_version) {
              window.location.reload();
            }

            return resolve();
          })
          .catch((e) => {
            console.error(e);
            resolve(); // TODO reject?
          });
      }

      return resolve();
    });
};

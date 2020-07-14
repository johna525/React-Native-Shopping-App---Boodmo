export function checkVersion({currentVersion, latestVersion}, local = false): boolean {
  if (local && (!currentVersion || !latestVersion)) {
    return true;
  }
  let currentVersionArray = getVersionArray(currentVersion);
  let latestVersionArray = getVersionArray(latestVersion);
  const isNeeded = checkUpdateNeeded(currentVersionArray, latestVersionArray);

  return isNeeded;
}

function getVersionArray(ver, delimiter = '.') {
  let versionArray = ver.split(delimiter);

  versionArray = versionArray.map((number) => {
    return parseInt(number);
  });

  if (versionArray.length === 1) {
    versionArray[1] = 0;
    versionArray[2] = 0;
  } else if (versionArray.length === 2) {
    versionArray[2] = 0;
  }

  return versionArray;
}

function checkUpdateNeeded(currentVersion, latestVersion) {
  if (currentVersion[0] < latestVersion[0]) {
    return true;
  } else if (currentVersion[0] > latestVersion[0]) {
    return false;
  } else if (currentVersion[1] < latestVersion[1]) {
    return true;
  } else if (currentVersion[1] > latestVersion[1]) {
    return false;
  } else if (currentVersion[2] < latestVersion[2]) {
    return true;
  } else if (currentVersion[2] > latestVersion[2]) {
    return false;
  } else {
    return false;
  }
}

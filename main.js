const { app, BrowserWindow, Tray, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let trayWindow;
let tray;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 420,
        height: 560,
        show: false,
        frame: false,
        resizable: false,
        skipTaskbar: true,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    mainWindow.loadFile('index.html');

    // AUTO-HIDE kalau klik di luar (kecuali DevTools lagi buka)
    mainWindow.on('blur', () => {
        if (!mainWindow.webContents.isDevToolsOpened()) {
            mainWindow.hide();
        }
    });

    // Bluetooth selector — pilih device sesuai target
    let targetDeviceName = "LED";
    mainWindow.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
        event.preventDefault();
        const result = deviceList.find(d => d.deviceName && d.deviceName.includes(targetDeviceName));
        if (result) callback(result.deviceId);
        // else biarkan timeout sendiri
    });

    ipcMain.on('target-bluetooth', (event, arg) => {
        targetDeviceName = arg;
    });
}

function createTrayWindow() {
    trayWindow = new BrowserWindow({
        width: 240,
        height: 360,
        show: false,
        frame: false,
        resizable: false,
        skipTaskbar: true,
        alwaysOnTop: true,
        transparent: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    trayWindow.loadFile('tray.html');
    trayWindow.on('blur', () => trayWindow.hide());
}

function toggleTrayWindow() {
    if (trayWindow.isVisible()) {
        trayWindow.hide();
    } else {
        const trayBounds = tray.getBounds();
        const windowBounds = trayWindow.getBounds();
        let x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
        let y = Math.round(trayBounds.y - windowBounds.height - 10);
        trayWindow.setPosition(x, y, false);
        trayWindow.show();
        trayWindow.focus();
    }
}

app.whenReady().then(() => {
    createMainWindow();
    createTrayWindow();

    const iconPath = path.join(__dirname, 'icon.png');
    tray = new Tray(iconPath);
    tray.setToolTip('Sandy LED Controller');

    // Klik kiri → Dashboard utama
    tray.on('click', () => {
        if (mainWindow) {
            mainWindow.center();
            mainWindow.show();
            mainWindow.focus();
        }
        if (trayWindow) trayWindow.hide();
    });

    // Klik kanan → Menu tray
    tray.on('right-click', () => {
        toggleTrayWindow();
    });
});

// ── IPC LISTENERS ──

ipcMain.on('hide-window', () => {
    if (mainWindow) mainWindow.hide();
});

// Relay dari tray ke dashboard — support target 'ALL'
ipcMain.on('relay-command', (event, data) => {
    if (!mainWindow) return;
    if (data.target === 'ALL') {
        // Kirim ke dashboard dengan target ALL, dashboard handle sendiri
        mainWindow.webContents.send('tray-command', 'ALL', data.action);
    } else {
        mainWindow.webContents.send('tray-command', data.target, data.action);
    }
});

ipcMain.on('open-dashboard', () => {
    if (mainWindow) {
        mainWindow.center();
        mainWindow.show();
        mainWindow.focus();
    }
    if (trayWindow) trayWindow.hide();
});

ipcMain.on('quit-app', () => {
    app.quit();
});
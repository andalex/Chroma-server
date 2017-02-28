const fs = require('fs');
const namer = require('color-namer');


// css comments
const palComments = [`
                    /*\n
                    * === CHROMA COLOR PALETTE : ) ===\n
                    */\n\n
                    `,
                    `
                    /*\n
                    * — Defaults —\n
                    */\n\n
                    `,
                    `
                    /*\n
                    * — Palette —\n
                    */\n\n
                    `,
                    `
                    /*\n
                    * — Font colors —\n
                    */\n\n
                    `,
                    `
                    /*\n
                    * — Background colors —\n
                    */\n\n
                    `];

const colorClassNames = ['.primary-alpha', 
                         '.primary-beta', 
                         '.accent-alpha', 
                         '.accent-beta',
                         '.accent-gamma'];

const genCss = function(paletteObject, scss, sendCss) {

let colorNames = [];
let scssVars = [];
let colorCss = [];
let fontcolorCss = [];
let cssData = '';
let noScss = '';

let fileType = scss ? 'palette.scss' : 'palette.css';

if(!scss) {
    colorCss.push(palComments[0],
                      palComments[1],
                      `.primary-font{ color: ${paletteObject.fontColor} !important;}\n\n`, 
                      `.primary-background { background-color: ${paletteObject.currentColor} !important;}\n\n`,
                      palComments[2]);

} else {
   scssVars.push(palComments[0],
                 palComments[1],
                 `$primaryFont: ${paletteObject.fontColor} !important;\n\n`,
                 `$primaryBackground: ${paletteObject.currentColor} !important;\n\n`,
                 `.primary-font {color: $primaryFont;} \n\n`, 
                 `.primary-background {background-color: $primaryBackground;}\n\n`, 
                 palComments[2]);
}

for(var ii= 0; ii < paletteObject.palette.length; ii++) {

    colorNames.push(namer(paletteObject.palette[ii]).html[0].name);

    if(scss) {
        colorCss.push(`${colorClassNames[ii]}{ background-color: ${paletteObject.palette[ii]} !important;}\n\n`);
        fontcolorCss.push(`${colorClassNames[ii]}-font { color: ${paletteObject.palette[ii]} !important;}\n\n`);
    } else {
        scssVars.push(`$${colorNames[ii]}: ${paletteObject.palette[ii]} !important;\n\n`);
        colorCss.push(`${colorClassNames[ii]}{ background-color: $${colorNames[ii]} !important;}\n\n`);
        fontcolorCss.push(`${colorClassNames[ii]}-font { color: $${colorNames[ii]} !important;}\n\n`);
    }

}

if(!scss) {
    cssData = `${colorCss.join('')}${fontcolorCss.join('')}`;
} else {
    cssData = `${scssVars.join('')}${colorCss.join('')}${fontcolorCss.join('')}`;
}

fs.writeFile((__dirname + `/public/${fileType}`), cssData, (err)=> {
if(err) console.log('from gen-css: ', err)
sendCss();
});

};

module.exports = genCss;
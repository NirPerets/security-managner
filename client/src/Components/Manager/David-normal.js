import { jsPDF } from "jspdf";
import font from './david-normal.ttf'

var callAddFont = function () {
console.log("here");
this.addFileToVFS('David-normal.ttf', font);
this.addFont('David-normal.ttf', 'David', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont])
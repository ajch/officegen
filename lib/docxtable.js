module.exports = {

  // assume passed in an array of row objects
  getTable: function(rows, tblOpts) {
    tblOpts = tblOpts || {};

    var self = this;

    return self._getBase(
      rows.map(function(row) {
        return self._getRow(
          row.map(function(cell) {
            cell = cell || {};
            if (typeof cell === 'string' || typeof cell === 'number') {
              var val = cell;
              cell = {
                val: val
              };
            }

            return self._getCell(cell.val, cell.opts, tblOpts);
          }),
          tblOpts
        );
      }),
      self._getColSpecs(rows, tblOpts),
      tblOpts
    );
  },

  _getBase: function(rowSpecs, colSpecs, opts) {
    var self = this;

    var baseTable = {
      "w:tbl": {
        "w:tblPr": {
			
          "w:tblStyle": {
            "@w:val": "TableGrid"
          },
          "w:tblW": {
            "@w:w": "0",
            "@w:type": "auto"
          },
          "w:tblLook": {
            "@w:val": "04A0",
            "@w:firstRow": "1",
            "@w:lastRow": "0",
            "@w:firstColumn": "1",
            "@w:lastColumn": "0",
            "@w:noHBand": "0",
            "@w:noVBand": "1"
          },
		  "w:tblCellMar":{
			  "w:top" : {
				  "@w:w":"0",
				  "@w:type":"dxa"
			  },
			   "w:bottom" : {
				  "@w:w":"0",
				  "@w:type":"dxa"
			  },
			   "w:start" : {
				  "@w:w":"0",
				  "@w:type":"dxa"
			  },
			   "w:end" : {
				  "@w:w":"0",
				  "@w:type":"dxa"
			  }
			  
			  
		  }
        },
        "w:tblGrid": {
          "#list": colSpecs
        },
        "#list": [rowSpecs]
      }
    };
    if (opts.borders) {
      baseTable["w:tbl"]["w:tblPr"]["w:tblBorders"] = {
        "w:top": {
          "@w:val": "single",
          "@w:sz": "6",
          "@w:space": "0",
          "@w:color": "000000"
        },
        "w:bottom": {
          "@w:val": "single",
          "@w:sz": "6",
          "@w:space": "0",
          "@w:color": "000000"
        },
        "w:left": {
          "@w:val": "single",
          "@w:sz": "6",
          "@w:space": "0",
          "@w:color": "000000"
        },
        "w:right": {
          "@w:val": "single",
          "@w:sz": "6",
          "@w:space": "0",
          "@w:color": "000000"
        },
        "w:insideH": {
          "@w:val": "single",
          "@w:sz": "6",
          "@w:space": "0",
          "@w:color": "000000"
        },
        "w:insideV": {
          "@w:val": "single",
          "@w:sz": "6",
          "@w:space": "0",
          "@w:color": "000000"
        }
      };
    }
    return baseTable;
  },

  _getColSpecs: function(cols, opts) {
    var self = this;
    return cols[0].map(function(val, idx) {
      return self._tblGrid(val.opts,opts);
    });
  },

  // TODO
  _tblGrid: function(opts,tableOpts) {
    return {
      "w:gridCol": {
        "@w:w": opts.cellColWidth || tableOpts.tableColWidth || "1"
      }
    };
  },


  _getRow: function(cells, opts) {
    return {
      "w:tr": {
        "@w:rsidR": "00995B51",
        "@w:rsidTr": "007F1D13",
		"w:trPr":{
			"w:trHeight" :{
				"@val":"100",
				"@hRule":"exact"
			}
		},
        "#list": [cells] // populate this with an array of table cell objects
      }
    };
  },


  _getVMerge: function(opts){
    if(opts.vMergeStart){
       return {"@val":"restart"};
    } else if(opts.vMergeContinue){
       return {"@val":"continue"};
    } else {
       return {};
    }
  },

  _getHMerge: function(opts){
    if(opts.hMergeStart){
       return {"@val":"restart"};
    } else if(opts.hMergeContinue){
       return {"@val":"continue"};
    } else {
       return {};
    }
  },

  _getCellBorder: function(opts){
     if(opts.noborder){
      return {
        "w:top": {
            "@w:val": "nil"
        },
        "w:left": {
            "@w:val": "nil"
        },
        "w:bottom": {
            "@w:val": "nil"
        },
        "w:right": {
            "@w:val": "nil"
        },
        "w:insideH": {
            "@w:val": "nil"
        },
        "w:insideV": {
            "@w:val": "nil"
        }
      }
     } else {
       return {};
     }
  },

  _getCell: function(val, opts, tblOpts) {
    opts = opts || {};
    var self = this;
    // var b = {};

    // if (opts.b) {
    //   b = {
    //     "w:tc": {
    //       "w:p": {
    //         "w:r": {
    //           "w:rPr": {
    //             "w:b": {}
    //           }
    //         }
    //       }
    //     }
    //   }
    // }

    var cellObj = {
      "w:tc": {
        "w:tcPr": {
          "w:tcW": {
            "@w:w": opts.cellColWidth || tblOpts.tableColWidth || "0",
            "@w:type": "dxa"
          },
          "w:gridSpan": {
            "@w:val" : opts.gridSpan || "1"
          },
          "w:vAlign": {
            "@w:val": "bottom"
          },
          "w:shd": {
            "@w:val": "clear",
            "@w:color": "auto",
            "@w:fill": opts.shd && opts.shd.fill || "",
            "@w:themeFill": opts.shd && opts.shd.themeFill || "",
            "@w:themeFillTint": opts.shd && opts.shd.themeFillTint || ""
          }
        },
        "w:p": {
          "@w:rsidR": "00995B51",
          "@w:rsidRPr": "00722E63",
          "@w:rsidRDefault": "00995B51",
          "w:pPr": {
            "w:jc": {
              "@w:val": opts.align || tblOpts.tableAlign || "center"
            },
            // "w:rPr": {
            //   "w:rFonts": {
            //     "@w:asciiTheme": "majorEastAsia",
            //     "@w:eastAsiaTheme": "majorEastAsia",
            //     "@w:hAnsiTheme": "majorEastAsia"
            //   },
            //   // "w:b": {},
            //   "w:sz": {
            //     "@w:val": "24"
            //   },
            //   "w:szCs": {
            //     "@w:val": "24"
            //   }
            // }
          },
          "w:r": {
            "@w:rsidRPr": "00722E63",
            "w:rPr": {
              "w:rFonts": {
                "@w:ascii": opts.fontFamily || tblOpts.tableFontFamily || "Arial",
                "@w:hAnsi": opts.fontFamily || tblOpts.tableFontFamily || "Arial"
              },
              "w:color": {
                "@w:val": opts.color || tblOpts.tableColor || "000"
              },
              "w:b": {},
              "w:sz": {
                "@w:val": opts.sz || tblOpts.sz || "24"
              },
              "w:szCs": {
                "@w:val": opts.sz || tblOpts.sz || "24"
              }
            },
            "w:t": val
          }
        }
      }
    };

    var vMerge = self._getVMerge(opts);
    if(vMerge['@val']){
      cellObj["w:tc"]["w:tcPr"]["w:vMerge"] = vMerge;
    }

    var hMerge = self._getHMerge(opts);
    if(hMerge['@val']){
      cellObj["w:tc"]["w:tcPr"]["w:hMerge"] = hMerge;
    }

    var cellBorder = self._getCellBorder(opts);
    if(cellBorder["w:top"]){
      cellObj["w:tc"]["w:tcPr"]["w:tcBorders"] = cellBorder;
    }

    if (!opts.b) {
      delete cellObj["w:tc"]["w:p"]["w:r"]["w:rPr"]["w:b"];
    }

    return cellObj;
  }
};

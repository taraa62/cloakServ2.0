export const contType = {

    "getContentTypeWithPath"(path:string):string {
        const arr = path.split(".");
        if (arr.length > 0) {
            let extension = arr[arr.length - 1];
            if (arr[arr.length - 1] === "map" && arr.length > 1) {
                extension = arr[arr.length - 2] + "." + arr[arr.length - 1];
            }
            if (this["." + extension]) {
                return this["." + extension];
            }
        }


        return null;
    },
    "getFormatFileByContentType"(ct:string):string {
        if (ct) {
            const list = Object.keys(this);
            for (const t of list) {
                if(this[t] === ct)return t;
            }
        }
        return null;
    },
    ".css.map": "application/json"
    // ,'.js.map': 'application/json'
    , ".ice": "x-conference/x-cooltalk"
    , ".movie": "video/x-sgi-movie"
    , ".avi": "video/x-msvideo"
    , ".wvx": "video/x-ms-wvx"
    , ".wmx": "video/x-ms-wmx"
    , ".wmv": "video/x-ms-wmv"
    , ".wm": "video/x-ms-wm"
    , ".asf": "video/x-ms-asf"
    , ".m4v": "video/x-m4v"
    , ".flv": "video/x-flv"
    , ".fli": "video/x-fli"
    , ".f4v": "video/x-f4v"
    , ".webm": "video/webm"
    , ".viv": "video/vnd.vivo"
    , ".uvu": "video/vnd.uvvu.mp4"
    , ".pyv": "video/vnd.ms-playready.media.pyv"
    , ".mxu": "video/vnd.mpegurl"
    , ".fvt": "video/vnd.fvt"
    , ".uvv": "video/vnd.dece.video"
    , ".uvs": "video/vnd.dece.sd"
    , ".uvp": "video/vnd.dece.pd"
    , ".uvm": "video/vnd.dece.mobile"
    , ".uvh": "video/vnd.dece.hd"
    , ".qt": "video/quicktime"
    , ".ogv": "video/ogg"
    , ".mpeg": "video/mpeg"
    , ".mp4": "video/mp4"
    , ".mj2": "video/mj2"
    , ".jpm": "video/jpm"
    , ".jpgv": "video/jpeg"
    , ".h264": "video/h264"
    , ".h263": "video/h263"
    , ".h261": "video/h261"
    , ".3g2": "video/3gpp2"
    , ".3gp": "video/3gpp"
    , ".yaml": "text/yaml"
    , ".vcf": "text/x-vcard"
    , ".vcs": "text/x-vcalendar"
    , ".uu": "text/x-uuencode"
    , ".etx": "text/x-setext"
    , ".p": "text/x-pascal"
    , ".java": "text/x-java-source,java"
    , ".f": "text/x-fortran"
    , ".c": "text/x-c"
    , ".s": "text/x-asm"
    , ".wmls": "text/vnd.wap.wmlscript"
    , ".wml": "text/vnd.wap.wml"
    , ".jad": "text/vnd.sun.j2me.app-descriptor"
    , ".spot": "text/vnd.in3d.spot"
    , ".3dml": "text/vnd.in3d.3dml"
    , ".gv": "text/vnd.graphviz"
    , ".flx": "text/vnd.fmi.flexstor"
    , ".fly": "text/vnd.fly"
    , ".scurl": "text/vnd.curl.scurl"
    , ".mcurl": "text/vnd.curl.mcurl"
    , ".dcurl": "text/vnd.curl.dcurl"
    , ".curl": "text/vnd.curl"
    , ".uri": "text/uri-list"
    , ".ttl": "text/turtle"
    , ".t": "text/troff"
    , ".tsv": "text/tab-separated-values"
    , ".sgml": "text/sgml"
    , ".rtx": "text/richtext"
    , ".dsc": "text/prs.lines.tag"
    , ".par": "text/plain-bas"
    , ".txt": "text/plain"
    , ".n3": "text/n3"
    , ".html": "text/html"
    , ".csv": "text/csv"
    , ".css": "text/css"
    , ".ics": "text/calendar"
    , ".wrl": "model/vrml"
    , ".vtu": "model/vnd.vtu"
    , ".mts": "model/vnd.mts"
    , ".gtw": "model/vnd.gtw"
    , ".gdl": "model/vnd.gdl"
    , ".dwf": "model/vnd.dwf"
    , ".dae": "model/vnd.collada+xml"
    , ".msh": "model/mesh"
    , ".igs": "model/iges"
    , ".eml": "message/rfc822"
    , ".xwd": "image/x-xwindowdump"
    , ".xpm": "image/x-xpixmap"
    , ".xbm": "image/x-xbitmap"
    , ".rgb": "image/x-rgb"
    , ".ppm": "image/x-portable-pixmap"
    , ".pgm": "image/x-portable-graymap"
    , ".pbm": "image/x-portable-bitmap"
    , ".pnm": "image/x-portable-anymap"
    //  , '.png': 'image/x-png'
    , ".pic": "image/x-pict"
    , ".pcx": "image/x-pcx"
    , ".ico": "image/x-icon"
    , ".fh": "image/x-freehand"
    , ".cmx": "image/x-cmx"
    , ".ras": "image/x-cmu-raster"
    // , '.png': 'image/x-citrix-png'
    // , '.jpeg, .jpg': 'image/x-citrix-jpeg'
    , ".webp": "image/webp"
    , ".xif": "image/vnd.xiff"
    , ".wbmp": "image/vnd.wap.wbmp"
    , ".npx": "image/vnd.net-fpx"
    , ".mdi": "image/vnd.ms-modi"
    , ".rlc": "image/vnd.fujixerox.edmics-rlc"
    , ".mmr": "image/vnd.fujixerox.edmics-mmr"
    , ".fst": "image/vnd.fst"
    , ".fpx": "image/vnd.fpx"
    , ".fbs": "image/vnd.fastbidsheet"
    , ".dxf": "image/vnd.dxf"
    , ".dwg": "image/vnd.dwg"
    , ".sub": "image/vnd.dvb.subtitle"
    , ".djvu": "image/vnd.djvu"
    , ".uvi": "image/vnd.dece.graphic"
    , ".psd": "image/vnd.adobe.photoshop"
    , ".tiff": "image/tiff"
    , ".svg": "image/svg+xml"
    , ".btif": "image/prs.btif"
    , ".png": "image/png"
    , ".pjpeg": "image/pjpeg"
    , ".ktx": "image/ktx"
    , ".jpeg": "image/jpeg"
    , ".jpg": "image/jpeg"
    , ".ief": "image/ief"
    , ".gif": "image/gif"
    , ".g3": "image/g3fax"
    , ".cgm": "image/cgm"
    , ".bmp": "image/bmp"
    , ".xyz": "chemical/x-xyz"
    , ".csml": "chemical/x-csml"
    , ".cml": "chemical/x-cml"
    , ".cmdf": "chemical/x-cmdf"
    , ".cif": "chemical/x-cif"
    , ".cdx": "chemical/x-cdx"
    , ".wav": "audio/x-wav"
    , ".rmp": "audio/x-pn-realaudio-plugin"
    , ".ram": "audio/x-pn-realaudio"
    , ".wma": "audio/x-ms-wma"
    , ".wax": "audio/x-ms-wax"
    , ".m3u": "audio/x-mpegurl"
    , ".aif": "audio/x-aiff"
    , ".aac": "audio/x-aac"
    , ".weba": "audio/webm"
    , ".rip": "audio/vnd.rip"
    , ".ecelp9600": "audio/vnd.nuera.ecelp9600"
    , ".ecelp7470": "audio/vnd.nuera.ecelp7470"
    , ".ecelp4800": "audio/vnd.nuera.ecelp4800"
    , ".pya": "audio/vnd.ms-playready.media.pya"
    , ".lvp": "audio/vnd.lucent.voice"
    , ".dtshd": "audio/vnd.dts.hd"
    , ".dts": "audio/vnd.dts"
    , ".dra": "audio/vnd.dra"
    , ".eol": "audio/vnd.digital-winds"
    , ".uva": "audio/vnd.dece.audio"
    , ".oga": "audio/ogg"
    , ".mpga": "audio/mpeg"
    , ".mp4a": "audio/mp4"
    , ".mid": "audio/midi"
    , ".au": "audio/basic"
    , ".adp": "audio/adpcm"
    , ".zip": "application/zip"
    , ".yin": "application/yin+xml"
    , ".yang": "application/yang"
    , ".mxml": "application/xv+xml"
    , ".xspf": "application/xspf+xml"
    , ".xslt": "application/xslt+xml"
    , ".xop": "application/xop+xml"
    , ".dtd": "application/xml-dtd"
    , ".xml": "application/xml"
    , ".xhtml": "application/xhtml+xml"
    , ".xenc": "application/xenc+xml"
    , ".xdf": "application/xcap-diff+xml"
    , ".xpi": "application/x-xpinstall"
    , ".fig": "application/x-xfig"
    , ".der": "application/x-x509-ca-cert"
    , ".src": "application/x-wais-source"
    , ".ustar": "application/x-ustar"
    , ".texinfo": "application/x-texinfo"
    , ".tfm": "application/x-tex-tfm"
    , ".tex": "application/x-tex"
    , ".tcl": "application/x-tcl"
    , ".tar": "application/x-tar"
    , ".sv4crc": "application/x-sv4crc"
    , ".sv4cpio": "application/x-sv4cpio"
    , ".sitx": "application/x-stuffitx"
    , ".sit": "application/x-stuffit"
    , ".xap": "application/x-silverlight-app"
    , ".swf": "application/x-shockwave-flash"
    , ".shar": "application/x-shar"
    , ".sh": "application/x-sh"
    , ".rar": "application/x-rar-compressed"
    , ".p7r": "application/x-pkcs7-certreqresp"
    , ".p7b": "application/x-pkcs7-certificates"
    , ".p12": "application/x-pkcs12"
    , ".nc": "application/x-netcdf"
    , ".wri": "application/x-mswrite"
    , ".trm": "application/x-msterminal"
    , ".scd": "application/x-msschedule"
    , ".pub": "application/x-mspublisher"
    , ".mny": "application/x-msmoney"
    , ".wmf": "application/x-msmetafile"
    , ".mvb": "application/x-msmediaview"
    , ".exe": "application/x-msdownload"
    , ".clp": "application/x-msclip"
    , ".crd": "application/x-mscardfile"
    , ".obd": "application/x-msbinder"
    , ".mdb": "application/x-msaccess"
    , ".xbap": "application/x-ms-xbap"
    , ".wmz": "application/x-ms-wmz"
    , ".wmd": "application/x-ms-wmd"
    , ".application": "application/x-ms-application"
    , ".prc": "application/x-mobipocket-ebook"
    , ".latex": "application/x-latex"
    , ".jnlp": "application/x-java-jnlp-file"
    , ".hdf": "application/x-hdf"
    , ".gtar": "application/x-gtar"
    , ".gnumeric": "application/x-gnumeric"
    , ".spl": "application/x-futuresplash"
    // , '.woff': 'application/x-font-woff'
    , ".woff": "font/woff"
    , ".woff2": "font/woff2"
    , ".pfa": "application/x-font-type1"
    , ".ttf": "application/x-font-ttf"
    , ".snf": "application/x-font-snf"
    , ".pcf": "application/x-font-pcf"
    , ".otf": "application/x-font-otf"
    , ".psf": "application/x-font-linux-psf"
    , ".gsf": "application/x-font-ghostscript"
    , ".bdf": "application/x-font-bdf"
    , ".dvi": "application/x-dvi"
    , ".res": "application/x-dtbresource+xml"
    , ".dtb": "application/x-dtbook+xml"
    , ".ncx": "application/x-dtbncx+xml"
    , ".wad": "application/x-doom"
    , ".dir": "application/x-director"
    , ".deb": "application/x-debian-package"
    , ".csh": "application/x-csh"
    , ".cpio": "application/x-cpio"
    , ".pgn": "application/x-chess-pgn"
    , ".chat": "application/x-chat"
    , ".vcd": "application/x-cdlink"
    , ".bz2": "application/x-bzip2"
    , ".bz": "application/x-bzip"
    , ".torrent": "application/x-bittorrent"
    , ".bcpio": "application/x-bcpio"
    , ".aas": "application/x-authorware-seg"
    , ".aam": "application/x-authorware-map"
    , ".aab": "application/x-authorware-bin"
    , ".dmg": "application/x-apple-diskimage"
    , ".ace": "application/x-ace-compressed"
    , ".abw": "application/x-abiword"
    , ".7z": "application/x-7z-compressed"
    , ".wspolicy": "application/wspolicy+xml"
    , ".wsdl": "application/wsdl+xml"
    , ".hlp": "application/winhlp"
    , ".wgt": "application/widget"
    , ".vxml": "application/voicexml+xml"
    , ".zaz": "application/vnd.zzazz.deck+xml"
    , ".zir": "application/vnd.zul"
    , ".cmp": "application/vnd.yellowriver-custom-menu"
    , ".spf": "application/vnd.yamaha.smaf-phrase"
    , ".saf": "application/vnd.yamaha.smaf-audio"
    , ".osfpvg": "application/vnd.yamaha.openscoreformat.osfpvg+xml"
    , ".osf": "application/vnd.yamaha.openscoreformat"
    , ".hvp": "application/vnd.yamaha.hv-voice"
    , ".hvs": "application/vnd.yamaha.hv-script"
    , ".hvd": "application/vnd.yamaha.hv-dic"
    , ".xfdl": "application/vnd.xfdl"
    , ".xar": "application/vnd.xara"
    , ".stf": "application/vnd.wt.stf"
    , ".wqd": "application/vnd.wqd"
    , ".wpd": "application/vnd.wordperfect"
    , ".nbp": "application/vnd.wolfram.player"
    , ".wtb": "application/vnd.webturbo"
    , ".wmlsc": "application/vnd.wap.wmlscriptc"
    , ".wmlc": "application/vnd.wap.wmlc"
    , ".wbxml": "application/vnd.wap.wbxml"
    , ".vsf": "application/vnd.vsf"
    , ".vis": "application/vnd.visionary"
    , ".vsdx": "application/vnd.visio2013"
    , ".vsd": "application/vnd.visio"
    , ".vcx": "application/vnd.vcx"
    , ".uoml": "application/vnd.uoml+xml"
    , ".unityweb": "application/vnd.unity"
    , ".umj": "application/vnd.umajin"
    , ".utz": "application/vnd.uiq.theme"
    , ".ufd": "application/vnd.ufdl"
    , ".tra": "application/vnd.trueapp"
    , ".mxs": "application/vnd.triscape.mxs"
    , ".tpt": "application/vnd.trid.tpt"
    , ".tmo": "application/vnd.tmobile-livetv"
    , ".tao": "application/vnd.tao.intent-module-archive"
    , ".xdm": "application/vnd.syncml.dm+xml"
    , ".bdm": "application/vnd.syncml.dm+wbxml"
    , ".xsm": "application/vnd.syncml+xml"
    , ".sis": "application/vnd.symbian.install"
    , ".svd": "application/vnd.svd"
    , ".sus": "application/vnd.sus-calendar"
    , ".stw": "application/vnd.sun.xml.writer.template"
    , ".sxg": "application/vnd.sun.xml.writer.global"
    , ".sxw": "application/vnd.sun.xml.writer"
    , ".sxm": "application/vnd.sun.xml.math"
    , ".sti": "application/vnd.sun.xml.impress.template"
    , ".sxi": "application/vnd.sun.xml.impress"
    , ".std": "application/vnd.sun.xml.draw.template"
    , ".sxd": "application/vnd.sun.xml.draw"
    , ".stc": "application/vnd.sun.xml.calc.template"
    , ".sxc": "application/vnd.sun.xml.calc"
    , ".sm": "application/vnd.stepmania.stepchart"
    , ".sgl": "application/vnd.stardivision.writer-global"
    , ".sdw": "application/vnd.stardivision.writer"
    , ".smf": "application/vnd.stardivision.math"
    , ".sdd": "application/vnd.stardivision.impress"
    , ".sda": "application/vnd.stardivision.draw"
    , ".sdc": "application/vnd.stardivision.calc"
    , ".sfs": "application/vnd.spotfire.sfs"
    , ".dxp": "application/vnd.spotfire.dxp"
    , ".sdkm": "application/vnd.solent.sdkm+xml"
    , ".teacher": "application/vnd.smart.teacher"
    , ".mmf": "application/vnd.smaf"
    , ".twd": "application/vnd.simtech-mindmapper"
    , ".ipk": "application/vnd.shana.informed.package"
    , ".iif": "application/vnd.shana.informed.interchange"
    , ".itp": "application/vnd.shana.informed.formtemplate"
    , ".ifm": "application/vnd.shana.informed.formdata"
    , ".semf": "application/vnd.semf"
    , ".semd": "application/vnd.semd"
    , ".sema": "application/vnd.sema"
    , ".see": "application/vnd.seemail"
    , ".st": "application/vnd.sailingtracker.track"
    , ".link66": "application/vnd.route66.link66+xml"
    , ".rm": "application/vnd.rn-realmedia"
    , ".cod": "application/vnd.rim.cod"
    , ".cryptonote": "application/vnd.rig.cryptonote"
    , ".musicxml": "application/vnd.recordare.musicxml+xml"
    , ".mxl": "application/vnd.recordare.musicxml"
    , ".bed": "application/vnd.realvnc.bed"
    , ".qxd": "application/vnd.quark.quarkxpress"
    , ".ptid": "application/vnd.pvi.ptid1"
    , ".qps": "application/vnd.publishare-delta-tree"
    , ".mgz": "application/vnd.proteus.magazine"
    , ".box": "application/vnd.previewsystems.box"
    , ".pbd": "application/vnd.powerbuilder6"
    , ".plf": "application/vnd.pocketlearn"
    , ".wg": "application/vnd.pmi.widget"
    , ".efif": "application/vnd.picsel"
    , ".ei6": "application/vnd.pg.osasli"
    , ".str": "application/vnd.pg.format"
    , ".paw": "application/vnd.pawaafile"
    , ".pdb": "application/vnd.palm"
    , ".dp": "application/vnd.osgi.dp"
    , ".mgp": "application/vnd.osgeo.mapguide.package"
    , ".dotx": "application/vnd.openxmlformats-officedocument.wordprocessingml.template"
    , ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    , ".xltx": "application/vnd.openxmlformats-officedocument.spreadsheetml.template"
    , ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    , ".potx": "application/vnd.openxmlformats-officedocument.presentationml.template"
    , ".ppsx": "application/vnd.openxmlformats-officedocument.presentationml.slideshow"
    , ".sldx": "application/vnd.openxmlformats-officedocument.presentationml.slide"
    , ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    , ".oxt": "application/vnd.openofficeorg.extension"
    , ".dd2": "application/vnd.oma.dd2+xml"
    , ".xo": "application/vnd.olpc-sugar"
    , ".oth": "application/vnd.oasis.opendocument.text-web"
    , ".ott": "application/vnd.oasis.opendocument.text-template"
    , ".odm": "application/vnd.oasis.opendocument.text-master"
    , ".odt": "application/vnd.oasis.opendocument.text"
    , ".ots": "application/vnd.oasis.opendocument.spreadsheet-template"
    , ".ods": "application/vnd.oasis.opendocument.spreadsheet"
    , ".otp": "application/vnd.oasis.opendocument.presentation-template"
    , ".odp": "application/vnd.oasis.opendocument.presentation"
    , ".oti": "application/vnd.oasis.opendocument.image-template"
    , ".odi": "application/vnd.oasis.opendocument.image"
    , ".otg": "application/vnd.oasis.opendocument.graphics-template"
    , ".odg": "application/vnd.oasis.opendocument.graphics"
    , ".odft": "application/vnd.oasis.opendocument.formula-template"
    , ".odf": "application/vnd.oasis.opendocument.formula"
    , ".odb": "application/vnd.oasis.opendocument.database"
    , ".otc": "application/vnd.oasis.opendocument.chart-template"
    , ".odc": "application/vnd.oasis.opendocument.chart"
    , ".ext": "application/vnd.novadigm.ext"
    , ".edx": "application/vnd.novadigm.edx"
    , ".edm": "application/vnd.novadigm.edm"
    , ".rpss": "application/vnd.nokia.radio-presets"
    , ".rpst": "application/vnd.nokia.radio-preset"
    , ".n-gage": "application/vnd.nokia.n-gage.symbian.install"
    , ".ngdat": "application/vnd.nokia.n-gage.data"
    , ".nnw": "application/vnd.noblenet-web"
    , ".nns": "application/vnd.noblenet-sealer"
    , ".nnd": "application/vnd.noblenet-directory"
    , ".nlu": "application/vnd.neurolanguage.nlu"
    , ".msty": "application/vnd.muvee.style"
    , ".mus": "application/vnd.musician"
    , ".mseq": "application/vnd.mseq"
    , ".xps": "application/vnd.ms-xpsdocument"
    , ".wpl": "application/vnd.ms-wpl"
    , ".wps": "application/vnd.ms-works"
    , ".dotm": "application/vnd.ms-word.template.macroenabled.12"
    , ".docm": "application/vnd.ms-word.document.macroenabled.12"
    , ".mpp": "application/vnd.ms-project"
    , ".potm": "application/vnd.ms-powerpoint.template.macroenabled.12"
    , ".ppsm": "application/vnd.ms-powerpoint.slideshow.macroenabled.12"
    , ".sldm": "application/vnd.ms-powerpoint.slide.macroenabled.12"
    , ".pptm": "application/vnd.ms-powerpoint.presentation.macroenabled.12"
    , ".ppam": "application/vnd.ms-powerpoint.addin.macroenabled.12"
    , ".ppt": "application/vnd.ms-powerpoint"
    , ".stl": "application/vnd.ms-pki.stl"
    , ".cat": "application/vnd.ms-pki.seccat"
    , ".thmx": "application/vnd.ms-officetheme"
    , ".lrm": "application/vnd.ms-lrm"
    , ".ims": "application/vnd.ms-ims"
    , ".chm": "application/vnd.ms-htmlhelp"
    , ".eot": "application/vnd.ms-fontobject"
    , ".xltm": "application/vnd.ms-excel.template.macroenabled.12"
    , ".xlsm": "application/vnd.ms-excel.sheet.macroenabled.12"
    , ".xlsb": "application/vnd.ms-excel.sheet.binary.macroenabled.12"
    , ".xlam": "application/vnd.ms-excel.addin.macroenabled.12"
    , ".xls": "application/vnd.ms-excel"
    , ".cab": "application/vnd.ms-cab-compressed"
    , ".cil": "application/vnd.ms-artgalry"
    , ".xul": "application/vnd.mozilla.xul+xml"
    , ".mpc": "application/vnd.mophun.certificate"
    , ".mpn": "application/vnd.mophun.application"
    , ".txf": "application/vnd.mobius.txf"
    , ".plc": "application/vnd.mobius.plc"
    , ".msl": "application/vnd.mobius.msl"
    , ".mqy": "application/vnd.mobius.mqy"
    , ".mbk": "application/vnd.mobius.mbk"
    , ".dis": "application/vnd.mobius.dis"
    , ".daf": "application/vnd.mobius.daf"
    , ".mif": "application/vnd.mif"
    , ".igx": "application/vnd.micrografx.igx"
    , ".flo": "application/vnd.micrografx.flo"
    , ".mfm": "application/vnd.mfmp"
    , ".mwf": "application/vnd.mfer"
    , ".cdkey": "application/vnd.mediastation.cdkey"
    , ".mc1": "application/vnd.medcalcdata"
    , ".mcd": "application/vnd.mcd"
    , ".portpkg": "application/vnd.macports.portpkg"
    , ".lwp": "application/vnd.lotus-wordpro"
    , ".scm": "application/vnd.lotus-screencam"
    , ".org": "application/vnd.lotus-organizer"
    , ".nsf": "application/vnd.lotus-notes"
    , ".pre": "application/vnd.lotus-freelance"
    , ".apr": "application/vnd.lotus-approach"
    , ".123": "application/vnd.lotus-1-2-3"
    , ".lbe": "application/vnd.llamagraphics.life-balance.exchange+xml"
    , ".lbd": "application/vnd.llamagraphics.life-balance.desktop"
    , ".lasxml": "application/vnd.las.las+xml"
    , ".sse": "application/vnd.kodak-descriptor"
    , ".skp": "application/vnd.koan"
    , ".kne": "application/vnd.kinar"
    , ".kia": "application/vnd.kidspiration"
    , ".htke": "application/vnd.kenameaapp"
    , ".kwd": "application/vnd.kde.kword"
    , ".ksp": "application/vnd.kde.kspread"
    , ".kpr": "application/vnd.kde.kpresenter"
    , ".kon": "application/vnd.kde.kontour"
    , ".flw": "application/vnd.kde.kivio"
    , ".kfo": "application/vnd.kde.kformula"
    , ".chrt": "application/vnd.kde.kchart"
    , ".karbon": "application/vnd.kde.karbon"
    , ".ktz": "application/vnd.kahootz"
    , ".joda": "application/vnd.joost.joda-archive"
    , ".jisp": "application/vnd.jisp"
    , ".rms": "application/vnd.jcp.javame.midlet-rms"
    , ".jam": "application/vnd.jam"
    , ".fcs": "application/vnd.isac.fcs"
    , ".xpr": "application/vnd.is-xpr"
    , ".irp": "application/vnd.irepository.package+xml"
    , ".rcprofile": "application/vnd.ipunplugged.rcprofile"
    , ".qfx": "application/vnd.intu.qfx"
    , ".qbo": "application/vnd.intu.qbo"
    , ".i2g": "application/vnd.intergeo"
    , ".xpw": "application/vnd.intercon.formnet"
    , ".igm": "application/vnd.insors.igm"
    , ".ivu": "application/vnd.immervision-ivu"
    , ".ivp": "application/vnd.immervision-ivp"
    , ".igl": "application/vnd.igloader"
    , ".icc": "application/vnd.iccprofile"
    , ".sc": "application/vnd.ibm.secure-container"
    , ".irm": "application/vnd.ibm.rights-management"
    , ".afp": "application/vnd.ibm.modcap"
    , ".mpy": "application/vnd.ibm.minipay"
    , ".x3d": "application/vnd.hzn-3d-crossword"
    , ".sfd-hdstx": "application/vnd.hydrostatix.sof-data"
    , ".pclxl": "application/vnd.hp-pclxl"
    , ".pcl": "application/vnd.hp-pcl"
    , ".jlt": "application/vnd.hp-jlyt"
    , ".hps": "application/vnd.hp-hps"
    , ".hpid": "application/vnd.hp-hpid"
    , ".hpgl": "application/vnd.hp-hpgl"
    , ".les": "application/vnd.hhe.lesson-player"
    , ".hbci": "application/vnd.hbci"
    , ".zmm": "application/vnd.handheld-entertainment+xml"
    , ".hal": "application/vnd.hal+xml"
    , ".vcg": "application/vnd.groove-vcard"
    , ".tpl": "application/vnd.groove-tool-template"
    , ".gtm": "application/vnd.groove-tool-message"
    , ".grv": "application/vnd.groove-injector"
    , ".gim": "application/vnd.groove-identity-message"
    , ".ghf": "application/vnd.groove-help"
    , ".gac": "application/vnd.groove-account"
    , ".gqf": "application/vnd.grafeq"
    , ".kmz": "application/vnd.google-earth.kmz"
    , ".kml": "application/vnd.google-earth.kml+xml"
    , ".gmx": "application/vnd.gmx"
    , ".g3w": "application/vnd.geospace"
    , ".g2w": "application/vnd.geoplan"
    , ".gxt": "application/vnd.geonext"
    , ".gex": "application/vnd.geometry-explorer"
    , ".ggt": "application/vnd.geogebra.tool"
    , ".ggb": "application/vnd.geogebra.file"
    , ".txd": "application/vnd.genomatix.tuxedo"
    , ".fzs": "application/vnd.fuzzysheet"
    , ".xbd": "application/vnd.fujixerox.docuworks.binder"
    , ".xdw": "application/vnd.fujixerox.docuworks"
    , ".ddd": "application/vnd.fujixerox.ddd"
    , ".bh2": "application/vnd.fujitsu.oasysprs"
    , ".fg5": "application/vnd.fujitsu.oasysgp"
    , ".oa3": "application/vnd.fujitsu.oasys3"
    , ".oa2": "application/vnd.fujitsu.oasys2"
    , ".oas": "application/vnd.fujitsu.oasys"
    , ".fsc": "application/vnd.fsc.weblaunch"
    , ".ltf": "application/vnd.frogans.ltf"
    , ".fnc": "application/vnd.frogans.fnc"
    , ".fm": "application/vnd.framemaker"
    , ".ftc": "application/vnd.fluxtime.clip"
    , ".gph": "application/vnd.flographit"
    , ".seed": "application/vnd.fdsn.seed"
    , ".fdf": "application/vnd.fdf"
    , ".ez3": "application/vnd.ezpix-package"
    , ".ez2": "application/vnd.ezpix-album"
    , ".es3": "application/vnd.eszigno3+xml"
    , ".ssf": "application/vnd.epson.ssf"
    , ".slt": "application/vnd.epson.salt"
    , ".qam": "application/vnd.epson.quickanime"
    , ".msf": "application/vnd.epson.msf"
    , ".esf": "application/vnd.epson.esf"
    , ".nml": "application/vnd.enliven"
    , ".mag": "application/vnd.ecowin.chart"
    , ".geo": "application/vnd.dynageo"
    , ".svc": "application/vnd.dvb.service"
    , ".ait": "application/vnd.dvb.ait"
    , ".dfac": "application/vnd.dreamfactory"
    , ".dpg": "application/vnd.dpgraph"
    , ".mlp": "application/vnd.dolby.mlp"
    , ".dna": "application/vnd.dna"
    , ".fe_launch": "application/vnd.denovo.fcselayout-link"
    , ".rdz": "application/vnd.data-vision.rdz"
    , ".pcurl": "application/vnd.curl.pcurl"
    , ".car": "application/vnd.curl.car"
    , ".ppd": "application/vnd.cups-ppd"
    , ".pml": "application/vnd.ctc-posml"
    , ".wbs": "application/vnd.criticaltools.wbs+xml"
    , ".clkw": "application/vnd.crick.clicker.wordbank"
    , ".clkt": "application/vnd.crick.clicker.template"
    , ".clkp": "application/vnd.crick.clicker.palette"
    , ".clkk": "application/vnd.crick.clicker.keyboard"
    , ".clkx": "application/vnd.crick.clicker"
    , ".cmc": "application/vnd.cosmocaller"
    , ".cdbcmsg": "application/vnd.contact.cmsg"
    , ".csp": "application/vnd.commonspace"
    , ".c11amz": "application/vnd.cluetrust.cartomobile-config-pkg"
    , ".c11amc": "application/vnd.cluetrust.cartomobile-config"
    , ".c4g": "application/vnd.clonk.c4group"
    , ".rp9": "application/vnd.cloanto.rp9"
    , ".cla": "application/vnd.claymore"
    , ".cdy": "application/vnd.cinderella"
    , ".mmd": "application/vnd.chipnuts.karaoke-mmd"
    , ".cdxml": "application/vnd.chemdraw+xml"
    , ".rep": "application/vnd.businessobjects"
    , ".bmi": "application/vnd.bmi"
    , ".mpm": "application/vnd.blueice.multipass"
    , ".aep": "application/vnd.audiograph"
    , ".swi": "application/vnd.aristanetworks.swi"
    , ".m3u8": "application/vnd.apple.mpegurl"
    , ".mpkg": "application/vnd.apple.installer+xml"
    , ".atx": "application/vnd.antix.game-component"
    , ".fti": "application/vnd.anser-web-funds-transfer-initiation"
    , ".cii": "application/vnd.anser-web-certificate-issue-initiation"
    , ".apk": "application/vnd.android.package-archive"
    , ".ami": "application/vnd.amiga.ami"
    , ".acc": "application/vnd.americandynamics.acc"
    , ".azw": "application/vnd.amazon.ebook"
    , ".azs": "application/vnd.airzip.filesecure.azs"
    , ".azf": "application/vnd.airzip.filesecure.azf"
    , ".ahead": "application/vnd.ahead.space"
    , ".xfdf": "application/vnd.adobe.xfdf"
    , ".xdp": "application/vnd.adobe.xdp+xml"
    , ".fxp": "application/vnd.adobe.fxp"
    , ".air": "application/vnd.adobe.air-application-installer-package+zip"
    , ".atc": "application/vnd.acucorp"
    , ".acu": "application/vnd.acucobol"
    , ".imp": "application/vnd.accpac.simply.imp"
    , ".aso": "application/vnd.accpac.simply.aso"
    , ".pwn": "application/vnd.3m.post-it-notes"
    , ".tcap": "application/vnd.3gpp2.tcap"
    , ".pvb": "application/vnd.3gpp.pic-bw-var"
    , ".psb": "application/vnd.3gpp.pic-bw-small"
    , ".plb": "application/vnd.3gpp.pic-bw-large"
    , ".tsd": "application/timestamped-data"
    , ".tfi": "application/thraud+xml"
    , ".tei": "application/tei+xml"
    , ".ssml": "application/ssml+xml"
    , ".sru": "application/sru+xml"
    , ".grxml": "application/srgs+xml"
    , ".gram": "application/srgs"
    , ".srx": "application/sparql-results+xml"
    , ".rq": "application/sparql-query"
    , ".smi": "application/smil+xml"
    , ".shf": "application/shf+xml"
    , ".setreg": "application/set-registration-initiation"
    , ".setpay": "application/set-payment-initiation"
    , ".sdp": "application/sdp"
    , ".spp": "application/scvp-vp-response"
    , ".spq": "application/scvp-vp-request"
    , ".scs": "application/scvp-cv-response"
    , ".scq": "application/scvp-cv-request"
    , ".sbml": "application/sbml+xml"
    , ".rtf": "application/rtf"
    , ".rss": "application/rss+xml"
    , ".rsd": "application/rsd+xml"
    , ".rs": "application/rls-services+xml"
    , ".rld": "application/resource-lists-diff+xml"
    , ".rl": "application/resource-lists+xml"
    , ".rnc": "application/relax-ng-compact-syntax"
    , ".rif": "application/reginfo+xml"
    , ".rdf": "application/rdf+xml"
    , ".pskcxml": "application/pskc+xml"
    , ".cww": "application/prs.cww"
    , ".ai": "application/postscript"
    , ".pls": "application/pls+xml"
    , ".pki": "application/pkixcmp"
    , ".pkipath": "application/pkix-pkipath"
    , ".crl": "application/pkix-crl"
    , ".cer": "application/pkix-cert"
    , ".ac": "application/pkix-attr-cert"
    , ".p8": "application/pkcs8"
    , ".p7s": "application/pkcs7-signature"
    , ".p7m": "application/pkcs7-mime"
    , ".p10": "application/pkcs10"
    , ".prf": "application/pics-rules"
    // , '.pgp': 'application/pgp-signature'
    // , '.pgp': 'application/pgp-encrypted'
    , ".pdf": "application/pdf"
    , ".xer": "application/patch-ops-error+xml"
    , ".onetoc": "application/onenote"
    , ".ogx": "application/ogg"
    , ".opf": "application/oebps-package+xml"
    , ".oda": "application/oda"
    , ".bin": "application/octet-stream"
    , ".mxf": "application/mxf"
    , ".doc": "application/msword"
    , ".m21": "application/mp21"
    , ".mods": "application/mods+xml"
    , ".mets": "application/mets+xml"
    , ".meta4": "application/metalink4+xml"
    , ".mscml": "application/mediaservercontrol+xml"
    , ".mbox": "application/mbox"
    , ".mathml": "application/mathml+xml"
    , ".ma": "application/mathematica"
    , ".mrcx": "application/marcxml+xml"
    , ".mrc": "application/marc"
    , ".mads": "application/mads+xml"
    , ".cpt": "application/mac-compactpro"
    , ".hqx": "application/mac-binhex40"
    , ".json": "application/json"
    , ".js": "application/javascript"
    // , '.axd': 'application/x-javascript' // off!!!
    , ".class": "application/java-vm"
    , ".ser": "application/java-serialized-object"
    , ".jar": "application/java-archive"
    , ".ipfix": "application/ipfix"
    , ".stk": "application/hyperstudio"
    , ".pfr": "application/font-tdpfr"
    , ".exi": "application/exi"
    , ".epub": "application/epub+zip"
    , ".emma": "application/emma+xml"
    , ".es": "application/ecmascript"
    , ".xdssc": "application/dssc+xml"
    , ".dssc": "application/dssc+der"
    , ".davmount": "application/davmount+xml"
    , ".cu": "application/cu-seeme"
    , ".cdmiq": "application/cdmi-queue"
    , ".cdmio": "application/cdmi-object"
    , ".cdmid": "application/cdmi-domain"
    , ".cdmic": "application/cdmi-container"
    , ".cdmia": "application/cdmi-capability"
    , ".ccxml": "application/ccxml+xml,"
    , ".atomsvc": "application/atomsvc+xml"
    , ".atomcat": "application/atomcat+xml"
    , ".atom": "application/atom+xml"
    , ".aw": "application/applixware"
    , "N/A": "application/andrew-inset",
};

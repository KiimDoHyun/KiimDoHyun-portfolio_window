"use strict";(self.webpackChunkportfolio=self.webpackChunkportfolio||[]).push([[11],{11:function(e,n,t){t.r(n),t.d(n,{default:function(){return b}});var r,c,i=t(413),a=t(885),o=t(791),s=t(168),l=t(31),d=t(542),u=t(109),h=(t(570),t(184)),p=80,x=(0,l.F4)(r||(r=(0,s.Z)(["\nfrom {\n    opacity: 0;\n    transform: scale(0.9);\n}\nto {\n    opacity: 1;\n    transform: scale(1);\n}\n"]))),m=l.ZP.div(c||(c=(0,s.Z)(["\n    left: calc(50% - 250px);\n    top: calc(50% - 250px);\n    height: 500px;\n    width: 500px;\n\n    box-shadow: 0px 0px 20px 3px #00000061;\n    position: absolute;\n\n    background-color: white;\n\n    z-index: ",";\n\n    display: grid;\n    grid-template-rows: 32px 25px 1fr 20px;\n\n    .modiSize {\n        position: absolute;\n        width: 4px;\n        height: 4px;\n        cursor: pointer;\n\n        // background-color: red;\n    }\n\n    .top_left {\n        top: 0;\n        left: 0;\n        cursor: nw-resize;\n    }\n\n    .top_right {\n        top: 0;\n        right: 0;\n        cursor: ne-resize;\n    }\n\n    .bottom_left {\n        bottom: 0;\n        left: 0;\n        cursor: ne-resize;\n    }\n\n    .bottom_right {\n        bottom: 0;\n        right: 0;\n        cursor: nw-resize;\n    }\n\n    .infoArea {\n        display: flex;\n        align-items: center;\n        gap: 5px;\n        height: 100%;\n        margin-left: 10px;\n    }\n\n    .infoArea img {\n        width: 20px;\n        height: 20px;\n    }\n    .infoArea div {\n        font-size: 14px;\n    }\n\n    .headerArea {\n        width: 100%;\n        height: 32px;\n\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n\n        padding: 1px 1px 0 1px;\n        box-sizing: border-box;\n    }\n\n    .headerArea2 {\n        gap: 10px;\n        padding: 0 10px;\n\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n    }\n\n    .arrowBox {\n        display: flex;\n        gap: 10px;\n    }\n    .arrowBox img {\n        width: 15px;\n        height: 100%;\n    }\n    .programTitle {\n    }\n\n    .routeBox {\n        flex: 1;\n\n        text-align: left;\n        padding: 0 10px;\n        font-size: 12px;\n        cursor: default;\n\n        display: flex;\n        align-items: center;\n        border: 1px solid #e3e3e3;\n        height: 100%;\n    }\n    .routeBox input {\n        width: 100%;\n        height: 100%;\n        margin: 0;\n        padding: 0;\n        border: none;\n        outline: none;\n    }\n\n    .selectDisplayType {\n        height: 100%;\n    }\n\n    .buttonArea {\n        height: 100%;\n        display: flex;\n        gap: 1px;\n    }\n\n    .min div {\n        width: 11px;\n        height: 1px;\n        background-color: black;\n    }\n\n    .max div {\n        width: 8px;\n        height: 8px;\n        border: 1px solid black;\n    }\n\n    .close div {\n        width: 14px;\n        height: 1px;\n        background-color: black;\n    }\n\n    .close div:nth-child(1) {\n        position: absolute;\n        rotate: 45deg;\n    }\n\n    .close div:nth-child(2) {\n        rotate: 135deg;\n    }\n\n    .buttonArea > div {\n        height: 100%;\n        width: 45px;\n        transition: 0.2s;\n\n        display: flex;\n        align-items: center;\n        justify-content: center;\n    }\n\n    .buttonArea > div > img {\n        width: 10px;\n    }\n\n    .buttonArea .min:hover,\n    .buttonArea .normalSize:hover,\n    .buttonArea .max:hover {\n        background-color: #ddddddb3;\n    }\n\n    .buttonArea > .close:hover {\n        background-color: #ff1010;\n    }\n\n    animation: "," 0.25s 0s;\n\n    .contentsArea_Cover {\n        width: 100%;\n        height: 100%;\n        overflow: scroll;\n        position: relative;\n    }\n\n    // \ubb38\uc11c \ucee8\ud150\uce20 \uc601\uc5ed\n    // 850 px \uc774\uc0c1\uc778 \uacbd\uc6b0  \ucc98\ub9ac \ud544\uc694\ud568.\n    .contentsArea_doc {\n        width: 100%;\n        height: 100%;\n\n        display: flex;\n        gap: 20px;\n        flex-wrap: wrap;\n        align-content: flex-start;\n        box-sizing: border-box;\n        padding: 10px;\n    }\n\n    .doc_imageArea {\n        width: 100%;\n        height: auto;\n        min-height: 200px;\n        background-color: gray;\n\n        max-width: 850px;\n    }\n\n    .doc_contentsArea {\n        flex: 1;\n    }\n\n    .doc_card {\n        text-align: left;\n\n        box-sizing: border-box;\n        padding: 20px 0;\n        border-bottom: 1px solid gray;\n    }\n\n    .cardTitle {\n        font-weight: bold;\n        margin-bottom: 10px;\n    }\n    .cardContent {\n        font-size: 12px;\n        color: #4b4b4b;\n    }\n\n    .doc_stack {\n        display: flex;\n        gap: 10px;\n        flex-wrap: wrap;\n    }\n    .stackItem {\n        border: 1px solid gray;\n        padding: 5px 10px;\n        border-radius: 5px;\n        width: fit-content;\n        position: relative;\n        cursor: pointer;\n    }\n\n    .stackItem:hover {\n        color: white;\n        background-color: gray;\n    }\n    .stackItem:hover .stackItem_Image {\n        bottom: -45px;\n        opacity: 1;\n        width: 40px;\n        height: 40px;\n        box-shadow: 0px 0px 10px 2px #a1a1a1;\n    }\n\n    .stackItem_Image {\n        position: absolute;\n\n        left: calc(50% - 20px);\n        width: 20px;\n        height: 20px;\n        bottom: -35px;\n\n        background-color: white;\n        opacity: 0;\n        transition: 0.2s;\n\n        box-sizing: border-box;\n        padding: 5px;\n    }\n\n    .stackItem_Image img {\n        width: 100%;\n        height: 100%;\n    }\n\n    // \uc774\ubbf8\uc9c0 \ucee8\ud150\uce20 \uc601\uc5ed\n    .contentsArea_image {\n        width: 100%;\n        height: 100%;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n\n        background-color: #20343b;\n    }\n\n    .image_arrow {\n        position: absolute;\n        height: 100%;\n        width: 50px;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        background-color: gray;\n        opacity: 0;\n        transition: 0.2s;\n    }\n    .image_arrow:hover {\n        opacity: 1;\n    }\n\n    .image_arrowLeft {\n        left: 0;\n    }\n\n    .image_arrowRight {\n        right: 0;\n    }\n\n    // \ud3f4\ub354\ud615 \ucee8\ud150\uce20 \uc601\uc5ed\n    .contentsArea_folder {\n        width: 100%;\n        height: 100%;\n\n        padding: 10px;\n        box-sizing: border-box;\n\n        display: flex;\n        gap: 20px;\n        flex-wrap: wrap;\n\n        align-content: flex-start;\n    }\n\n    // \uc544\uc8fc \ud070 \uc544\uc774\ucf58\n    .BIG_BIG_ICON .folder {\n        width: ","px;\n    }\n\n    .BIG_BIG_ICON img {\n        width: ","px;\n        height: ","px;\n    }\n\n    // \ud070 \uc544\uc774\ucf58\n    .BIG_ICON .folder {\n        width: ","px;\n    }\n\n    .BIG_ICON img {\n        width: ","px;\n        height: ","px;\n    }\n\n    // \ubcf4\ud1b5 \uc544\uc774\ucf58\n    .MEDIUM_ICON .folder {\n        width: ","px;\n    }\n\n    .MEDIUM_ICON img {\n        width: ","px;\n        height: ","px;\n    }\n\n    // \uc791\uc740 \uc544\uc774\ucf58\n    .SMALL_ICON .folder {\n        width: ","px;\n    }\n\n    .SMALL_ICON img {\n        width: ","px;\n        height: ","px;\n    }\n\n    // \uc790\uc138\ud788\n    .DETAIL {\n        gap: 0px;\n    }\n\n    .DETAIL .folder {\n        width: 100%;\n        display: grid;\n        grid-template-columns: 1fr 1fr 1fr;\n    }\n    .DETAIL .folder div {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n    }\n\n    .DETAIL img {\n        width: ","px;\n        height: ","px;\n    }\n\n    .folder {\n        height: auto;\n        padding: 5px 10px;\n        border: 1px solid #ffffff00;\n    }\n\n    .folder_selected {\n        background-color: #cce8ff !important;\n        border: 1px solid #99d1ff;\n    }\n    .folder:hover {\n        background-color: #e5f3ff;\n    }\n    .folder .name {\n        word-break: break-all;\n        font-size: 12px;\n        cursor: default;\n    }\n\n    .detailHeader {\n        display: grid;\n        grid-template-columns: 1fr 1fr 1fr;\n        width: 100%;\n        padding: 5px 10px;\n    }\n\n    .detailHeader .name {\n        font-size: 11px;\n        cursor: default;\n    }\n\n    .bottomArea {\n        width: 100%;\n        display: flex;\n        align-items: center;\n        justify-content: flex-start;\n        font-size: 12px;\n        padding: 0 10px;\n    }\n\n    .noContents {\n        width: 100%;\n        height: 100%;\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        color: gray;\n        font-size: 14px;\n        cursor: default;\n    }\n\n    ","\n"])),(function(e){return e.zIndexCnt}),x,160,160,160,120,120,120,p,p,p,40,40,40,20,20,(function(e){return e.isClose&&" opacity: 0; transform: scale(0.9)"})),f=function(e){var n=e.onClick,t=e.onClickClose,r=e.onClickMax,c=e.onClickNormalSize,i=e.onClickMin,a=e.onMouseDown,o=e.onMouseUp,s=e.onMouseDown_Resize,l=e.onMouseUp_Resize,p=e.onClickItem,x=e.onDoubleClickItem,f=e.onClickLeft,g=(e.onClickRight,e.setDisplayType),v=e.boxRef,y=e.isClose,A=e.isMaxSize,j=e.item,w=e.selectedItem,C=e.folderContents,b=e.displayType,I=e.displayList,k=e.currentFolder,N=e.IMG_onClickLeft,S=e.IMG_onClickRight,D=e.imageArr,E=e.curImageIdx,M=e.DOCData;return(0,h.jsxs)(m,{className:"folderComponent",ref:v,isClose:y,onMouseDown:n,isMaxSize:A,children:[(0,h.jsxs)("div",{className:"headerArea",onMouseDown:a,onMouseUp:o,children:[(0,h.jsxs)("div",{className:"infoArea",children:[("FOLDER"===j.type||"BROWSER"===j.type)&&(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("img",{src:j.icon||d,alt:j.name}),(0,h.jsx)("div",{className:"programTitle",children:j.name})]}),"IMAGE"===j.type&&D.length>0&&(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("img",{src:u,alt:"\uc774\ubbf8\uc9c0"}),(0,h.jsx)("div",{className:"programTitle",children:D[E].name})]}),"DOC"===j.type&&(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("img",{src:u,alt:"\uc774\ubbf8\uc9c0"}),(0,h.jsx)("div",{className:"programTitle",children:j.name})]})]}),(0,h.jsxs)("div",{className:"buttonArea",children:[(0,h.jsx)("div",{className:"min",onClick:i,children:(0,h.jsx)("div",{})}),A?(0,h.jsx)("div",{className:"normalSize",onClick:c,children:(0,h.jsx)("div",{})}):(0,h.jsx)("div",{className:"max",onClick:r,children:(0,h.jsx)("div",{})}),(0,h.jsxs)("div",{className:"close",onClick:t,children:[(0,h.jsx)("div",{}),(0,h.jsx)("div",{})]})]})]}),(0,h.jsx)("div",{className:"headerArea2",children:"FOLDER"===j.type&&(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("div",{className:"arrowBox",children:(0,h.jsx)("img",{src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAABL0lEQVRoge3YPy5EQRwH8E82tkCxnQM4gAM4ASEK4RwcgM4RxAVI9IQDEEpqDZL1pyA6jURWsdbGzr7ivRWzL/l9kum/3zdv3sw8QgghhBBC+GMreMQr1jJnqWwRH+h8j5e8caqZx7t+iQ6esyaqYA5vfpf4xHrOUGXN4snvEh1s5AxV1gxupCW2coYqq4VraYndnKHKmsK5tMQ+GhlzldLEqbTEESYy5iqlgUNpiQvdWaqNPWmJcR93uhv1j50xCFV1PNBfvJ1hU1RXdXy1brEwWKRosV9iesSH9O+aOJGWOVajz2/PJM6kZQ7UaEPsaeFKWqZWR5SeokPjds5QVRUd4zdzhqqq6GK1mjNUVcOuuvdZE41g8OdDO2+c0SzrHtTaWMqcJYQQQgghhHK+AHty7pyn/ARjAAAAAElFTkSuQmCC",alt:"leftArrow",onClick:f})}),(0,h.jsx)("div",{className:"routeBox",children:(0,h.jsx)("input",{value:k.route||"/ [error]",readOnly:!0})}),(0,h.jsx)("div",{className:"selectDisplayType",children:(0,h.jsx)("select",{value:b,onChange:function(e){return g(e.target.value)},children:I.map((function(e,n){return(0,h.jsx)("option",{value:e.value,children:e.name},n)}))})})]})}),(0,h.jsxs)("div",{className:"contentsArea_Cover",children:["BROWSER"===j.type&&(0,h.jsx)("iframe",{src:"https://www.google.com/webhp?igu=1",width:"100%",height:"100%"}),"FOLDER"===j.type&&(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("div",{className:"sideFolderArea"}),(0,h.jsx)("div",{className:"".concat(b," contentsArea_folder"),children:C&&C.length>0?(0,h.jsxs)(h.Fragment,{children:["DETAIL"===b&&(0,h.jsxs)("div",{className:"detailHeader",children:[(0,h.jsx)("div",{className:"name",children:"\uc774\ubbf8\uc9c0"}),(0,h.jsx)("div",{className:"name",children:"\uc774\ub984"}),(0,h.jsx)("div",{className:"name",children:"\uc720\ud615"})]}),C.map((function(e,n){return(0,h.jsxs)("div",{className:"".concat(w===e.name?"folder folder_selected":"folder"),onClick:function(){return p(e.name)},onDoubleClick:function(){return x(e)},children:[(0,h.jsx)("div",{className:"imgCover",children:"FOLDER"===e.type?(0,h.jsx)("img",{src:e.folderCnt?"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAEyElEQVRoge1YTYscVRQ9t7p7RgchaAZBXBg/EMGfoNGFbgLuBJdu8j8U3PgPXBlEEN0LYhDduHMjiAhuDBLxKzpOEshMHKfecVHvvbr3vlvVLSGK0Bea99HVXeece+591Q1sYxvb+F+HAMDxZw89QsglAOdB2SEAUMB8CYcJCAGoRxwJ8CUob5258P0H/wWBbhjkEoAXKngU8KgjMmgbskfKswl4//DjR98mB0H+zegAgMB56HtXoCPokVBVX+0LQFy8fvnca3cdsYucAeyMoJT6AZEx7B4BkN3rBx899vLdAhtFsZBF4vbaGtCXivMZ3jm4/MTTdwVtEAIAR58+zKZgKRmktlFTxOozahwuVp9t90q52M+MY77c7GUYJ0zy+SnSxcdf+ebqslzY7T+PxZNvALsPggRI5hvRrdWctGsQq/Qb9vpvIekEQAKY8sg89nlvGFnW7N3r1I7pFOApmP7a+fPWjRev//jdewCeW5ZULJ56E1zeD/ZEIkESKQ0jE5EIMK9T3SOYEjqcYIWb2Ot+xS6ugUc/IZ3eypIzS+Tmo8a62GZiCXQroLsX95y5Dw8sls8AX2AJALJzFsuTq5DjrweVZiPfrMtAFgRSD/TH4O1DpJM/ssIRaL2eIuDJyDgoW6/29rtMC9g59ypwdAVMx0AqqU7jyHaPYGCPAi5hUvmGgO7TU5mQYBzmSwDoVvtAfxwCNfMMmm4dktggCzSKcx4/R/CiOuRQA7y9HvwkcL32wC0Jrq0F2DUkg7fq1/ZdCYS2mQIfdZYJEsVqmxZzFOYtZSHRBLyi68CH6nubeUvldUVVLDNXwB54AY9qqWwhBaQB368HrTJCTBX2TAHP+b/iVuorS+UMTCkfgd+kuKOOpJWPSEDtBeq7OihTlYEJ26wFn8CI0KbqGzJzUc6DQijMwHDjEHxDpJ8obu33DQ+y0leamhCNFdY+pgZGTxs1tdcrwNFWDdGpcyAgIo3y0xkQuiKGVFJjBqJTd21n6tW+Vl2BpwftMxKBJ2znycAFdV+aLmQ6yBT4fgK8B54ccJ8N2LUG3jponKjT2HWhDJ4eRJuRefCWiOishPWg1Q8stOYQazJgANT1OvC+5w970rTRCRIA5juRspJk5f05QFiVPfDJzhQ9TlTwXpSpbvQP2ijbLLgMqBs3Voo6TQR+rh5SC9y01YiIe5SuWfDPQt7z1UrJFbcGHYGPLDV3NuT7h91IkSgdiJaQfRZqMlCsE/R184rAz3cmSwTBqNVHBu6yAP80qlNdgbtiDsYY/GZnQ0wiyIAGzoiAUX9Yt9ZhM0pYD3FxW+Blf7y/VPw06tPYJ79sEVs7GCLh6emV92dCBL6tBWnUj9uo1LYp4GQRO8BV/ajrRHVAS661kbWoNDYqJKIYLSQsRDpHwIOJlFcgxFtqssdbIuZ0nj2ZC3b9Q2a0T7Hbcrxy/KL1v2OnfK+yFmShPSPKXN/fhbKPKWJdA0Q3KLNOTa9+9JwTjkGnCjuTz4A7eVUG+rQLIP87fXjlk5uURf6xHFgoKrZZC23QZpun3SgD2rr5P1MQPXfx8w+/36gZSEe/XLj21bsf9n1/ts3h+hj45n+dKXVt53a8k+gWi4NutXjpjr5kG9vYxja2AQB/A6o4XE7+VqieAAAAAElFTkSuQmCC":d,alt:"folderEmpty"}):(0,h.jsx)("img",{src:e.icon||u,alt:e.name})}),(0,h.jsx)("div",{className:"name",children:e.name}),"DETAIL"===b&&(0,h.jsx)("div",{className:"name",children:e.type})]},n)}))]}):(0,h.jsx)("div",{className:"noContents",children:"\ube44\uc5b4\uc788\uc2b5\ub2c8\ub2e4."})})]}),"IMAGE"===j.type&&(0,h.jsxs)("div",{className:"contentsArea_image",children:[(0,h.jsx)("div",{className:"image_arrow image_arrowLeft",title:"\uc774\uc804",onClick:N,children:"<"}),(0,h.jsx)("div",{className:"image_arrow image_arrowRight",title:"\ub2e4\uc74c",onClick:S,children:">"}),D.length>0&&(0,h.jsx)("img",{className:"imageContent",src:D[E].icon,alt:D[E].name})]}),"DOC"===j.type&&(0,h.jsxs)("div",{className:"contentsArea_doc",children:[(0,h.jsx)("div",{className:"doc_imageArea"}),(0,h.jsxs)("div",{className:"doc_contentsArea",children:[(0,h.jsxs)("div",{className:"doc_card",children:[(0,h.jsx)("div",{className:"cardTitle",children:"\ud504\ub85c\uc81d\ud2b8 \uba85"}),(0,h.jsx)("div",{className:"cardContent",children:M.data.projectName})]}),(0,h.jsxs)("div",{className:"doc_card",children:[(0,h.jsx)("div",{className:"cardTitle",children:"\ud504\ub85c\uc81d\ud2b8 \uc124\uba85"}),(0,h.jsx)("div",{className:"cardContent",children:M.data.projectDesc})]}),(0,h.jsxs)("div",{className:"doc_card",children:[(0,h.jsx)("div",{className:"cardTitle",children:"\ud504\ub85c\uc81d\ud2b8 \uae30\uac04"}),(0,h.jsx)("div",{className:"cardContent",children:M.data.projectTerm.map((function(e,n){return(0,h.jsx)("div",{children:e},n)}))})]}),(0,h.jsxs)("div",{className:"doc_card",children:[(0,h.jsx)("div",{className:"cardTitle",children:"\ud504\ub85c\uc81d\ud2b8 \uc131\uaca9"}),(0,h.jsx)("div",{className:"cardContent",children:M.data.projectType})]}),(0,h.jsxs)("div",{className:"doc_card",children:[(0,h.jsx)("div",{className:"cardTitle",children:"\ub2f4\ub2f9 \uc5ed\ud560"}),(0,h.jsx)("div",{className:"cardContent",children:M.data.role.map((function(e,n){return(0,h.jsxs)("div",{children:["".concat(n+1,". "),e]},n)}))})]}),(0,h.jsxs)("div",{className:"doc_card",children:[(0,h.jsx)("div",{className:"cardTitle",children:"\uac1c\ubc1c\ubd80\uc11c"}),(0,h.jsx)("div",{className:"cardContent",children:M.data.department})]}),(0,h.jsxs)("div",{className:"doc_card",children:[(0,h.jsx)("div",{className:"cardTitle",children:"\uc0ac\uc6a9\ud55c \uae30\uc220 \uc2a4\ud0dd"}),(0,h.jsx)("div",{className:"cardContent doc_stack",children:M.data.stack.map((function(e,n){return(0,h.jsxs)("div",{className:"stackItem",children:[(0,h.jsx)("div",{className:"stackItem_name",children:e.name}),(0,h.jsx)("div",{className:"stackItem_Image",children:(0,h.jsx)("img",{src:e.img,alt:"stackImage"})})]},n)}))})]}),(0,h.jsxs)("div",{className:"doc_card",children:[(0,h.jsx)("div",{className:"cardTitle",children:"url"}),(0,h.jsx)("div",{className:"cardContent",children:M.data.url})]})]})]})]}),"FOLDER"===j.type&&(0,h.jsxs)("div",{className:"bottomArea",children:[C.length," \uac1c\ud56d\ubaa9"]}),"IMAGE"===j.type&&(0,h.jsxs)("div",{className:"bottomArea",children:[E+1," / ",D.length]}),(0,h.jsx)("div",{className:"modiSize top_left"}),(0,h.jsx)("div",{className:"modiSize top_right"}),(0,h.jsx)("div",{className:"modiSize right"}),(0,h.jsx)("div",{className:"modiSize bottom_left"}),(0,h.jsx)("div",{className:"modiSize bottom_right",onMouseDown:s,onMouseUp:l})]})},g=t(965),v=t(334),y=t(604),A=t(477),j=t(80),w=[{value:"BIG_BIG_ICON",name:"\uc544\uc8fc \ud070 \uc544\uc774\ucf58"},{value:"BIG_ICON",name:"\ud070 \uc544\uc774\ucf58"},{value:"MEDIUM_ICON",name:"\ubcf4\ud1b5 \uc544\uc774\ucf58"},{value:"SMALL_ICON",name:"\uc791\uc740 \uc544\uc774\ucf58"},{value:"DETAIL",name:"\uc790\uc138\ud788"}],C=function(e){var n=e.item,t=n.name,r=n.status,c=(0,v.sJ)(y.SI),s=(0,v.sJ)(y.F5),l=(0,v.Zl)(g.uX),d=(0,v.FV)(g.wf),u=(0,a.Z)(d,2),p=u[0],x=u[1],m=p,C=(0,v.FV)(g.Pg),b=(0,a.Z)(C,2),I=b[0],k=b[1],N=(0,o.useState)(!1),S=(0,a.Z)(N,2),D=S[0],E=S[1],M=(0,o.useState)(!1),T=(0,a.Z)(M,2),L=T[0],R=T[1],_=(0,o.useState)(!1),Y=(0,a.Z)(_,2),z=Y[0],B=Y[1],O=(0,o.useState)(!1),X=(0,a.Z)(O,2),Q=X[0],Z=X[1],G=(0,o.useState)(s.find((function(e){return n.name===e.name}))),H=(0,a.Z)(G,2),F=H[0],W=H[1],V=(0,o.useState)(c[n.name]||[]),J=(0,a.Z)(V,2),U=J[0],K=J[1],P=(0,o.useState)([n.contents]),q=(0,a.Z)(P,2),$=q[0],ee=(q[1],(0,o.useState)("")),ne=(0,a.Z)(ee,2),te=ne[0],re=ne[1],ce=(0,o.useState)(w[2].value),ie=(0,a.Z)(ce,2),ae=ie[0],oe=ie[1],se=(0,A.Z)(),le=(0,o.useRef)(),de=(0,o.useRef)(),ue=(0,o.useCallback)((function(){k(t)}),[k,t]),he=(0,o.useCallback)((function(){Z(!0),de.current.style.transition="0.25s",de.current.style.left="0",de.current.style.top="0",localStorage.setItem("".concat(t,"width"),"100vw"),localStorage.setItem("".concat(t,"height"),"calc(100vh - 50px)"),de.current.style.width="100vw",de.current.style.height="calc(100vh - 50px)"}),[Z,l]),pe=(0,o.useCallback)((function(){Z(!1);var e=localStorage.getItem("".concat(t,"Left")),n=localStorage.getItem("".concat(t,"Top"));de.current.style.transition="0.25s",e&&n?(de.current.style.left=e+"px",de.current.style.top=n+"px"):(de.current.style.left="calc(50vw - 250px)",de.current.style.top="calc(50vh - 250px)"),localStorage.setItem("".concat(t,"width"),"500px"),localStorage.setItem("".concat(t,"height"),"500px"),de.current.style.width="500px",de.current.style.height="500px"}),[Z,l]),xe=(0,o.useCallback)((function(){l((function(e){return e.map((function(e){return e.name===t?(0,i.Z)((0,i.Z)({},e),{},{status:"min"}):(0,i.Z)({},e)}))}))}),[t,l]),me=(0,o.useCallback)((function(){B(!0),de.current.style.transition="0.25s",de.current.style.opacity="0",setTimeout((function(){l((function(e){return e.filter((function(e){return e.name!==t}))}))}),[300])}),[t,l]),fe=(0,o.useCallback)((function(e){E(!0),le.current={X:e.clientX,Y:e.clientY}}),[E]),ge=(0,o.useCallback)((function(e){if(D){var n=le.current.X-e.clientX,r=le.current.Y-e.clientY;le.current={X:e.clientX,Y:e.clientY},de.current.style.transition="0s",localStorage.setItem("".concat(t,"Left"),de.current.offsetLeft-n),localStorage.setItem("".concat(t,"Top"),de.current.offsetTop-r),de.current.style.left=de.current.offsetLeft-n+"px",de.current.style.top=de.current.offsetTop-r+"px"}if(L){de.current.style.transition="0s";var c=le.current.X-e.clientX,i=le.current.Y-e.clientY,a=de.current.offsetWidth-c,o=de.current.offsetHeight-i;0===c&&i>0?o<60||(localStorage.setItem("".concat(t,"height"),"".concat(de.current.offsetHeight-i,"px")),de.current.style.height=de.current.offsetHeight-i+"px",le.current.Y=e.clientY):0===c&&i<0?le.current.Y<=e.clientY&&(localStorage.setItem("".concat(t,"height"),"".concat(de.current.offsetHeight-i,"px")),de.current.style.height=de.current.offsetHeight-i+"px",le.current.Y=e.clientY):c>0&&0===i?a<300||(localStorage.setItem("".concat(t,"width"),"".concat(de.current.offsetWidth-c,"px")),de.current.style.width=de.current.offsetWidth-c+"px",le.current.X=e.clientX):c<0&&0===i?le.current.X<=e.clientX&&(localStorage.setItem("".concat(t,"width"),"".concat(de.current.offsetWidth-c,"px")),de.current.style.width=de.current.offsetWidth-c+"px",le.current.X=e.clientX):c>0&&i>0?(a<300||(localStorage.setItem("".concat(t,"width"),"".concat(de.current.offsetWidth-c,"px")),de.current.style.width=de.current.offsetWidth-c+"px",le.current.X=e.clientX),o<60||(localStorage.setItem("".concat(t,"height"),"".concat(de.current.offsetHeight-i,"px")),de.current.style.height=de.current.offsetHeight-i+"px",le.current.Y=e.clientY)):c<0&&i>0?(le.current.X<=e.clientX&&(localStorage.setItem("".concat(t,"width"),"".concat(de.current.offsetWidth-c,"px")),de.current.style.width=de.current.offsetWidth-c+"px",le.current.X=e.clientX),o<60||(localStorage.setItem("".concat(t,"height"),"".concat(de.current.offsetHeight-i,"px")),de.current.style.height=de.current.offsetHeight-i+"px",le.current.Y=e.clientY)):c>0&&i<0?(a<300||(localStorage.setItem("".concat(t,"width"),"".concat(de.current.offsetWidth-c,"px")),de.current.style.width=de.current.offsetWidth-c+"px",le.current.X=e.clientX),le.current.Y<=e.clientY&&(localStorage.setItem("".concat(t,"height"),"".concat(de.current.offsetHeight-i,"px")),de.current.style.height=de.current.offsetHeight-i+"px",le.current.Y=e.clientY)):c<0&&i<0&&(le.current.X<=e.clientX&&(localStorage.setItem("".concat(t,"width"),"".concat(de.current.offsetWidth-c,"px")),de.current.style.width=de.current.offsetWidth-c+"px",le.current.X=e.clientX),le.current.Y<=e.clientY&&(localStorage.setItem("".concat(t,"height"),"".concat(de.current.offsetHeight-i,"px")),de.current.style.height=de.current.offsetHeight-i+"px",le.current.Y=e.clientY))}}),[D,L]),ve=(0,o.useCallback)((function(){E(!1)}),[]);(0,o.useEffect)((function(){I===t&&(de.current.style.zIndex=m+1,x((function(e){return e+1})))}),[I,t,x]),(0,o.useEffect)((function(){return document.addEventListener("mousemove",ge),document.addEventListener("mouseup",(function(){return R(!1)})),function(){document.removeEventListener("mousemove",ge)}}),[ge]),(0,o.useEffect)((function(){if("active"===r)if(Q)de.current.style.left="0px",de.current.style.top="0px";else{var e=localStorage.getItem("".concat(t,"Left")),n=localStorage.getItem("".concat(t,"Top"));e&&n?(de.current.style.left=e+"px",de.current.style.top=n+"px"):(de.current.style.left="calc(50vw - 250px)",de.current.style.top="calc(50vh - 250px)")}}),[r,Q,de]),(0,o.useEffect)((function(){if("active"===r){de.current.style.transition="0.25s",de.current.style.opacity="1";var e=localStorage.getItem("".concat(t,"height")),n=localStorage.getItem("".concat(t,"width"));e&&n?(de.current.style.height=e,de.current.style.width=n):(de.current.style.width="500px",de.current.style.height="500px"),de.current.style.scale="1"}else"min"===r&&(de.current.style.transition="0.25s",de.current.style.opacity="0",de.current.style.left="80px",de.current.style.top="60vh",de.current.style.scale="0.6",de.current.style.width="500px",de.current.style.height="500px")}),[r]);var ye=(0,o.useCallback)((function(e){R(!0),le.current={X:e.clientX,Y:e.clientY}}),[]),Ae=((0,o.useCallback)((function(){}),[]),(0,o.useCallback)((function(){R(!1)}),[])),je=(0,o.useCallback)((function(e){re(e)}),[]),we=(0,o.useCallback)((function(e){"FOLDER"===e.type?(W(s.find((function(n){return e.name===n.name}))),K(c[e.name]||[])):se(e)}),[c,$,s]),Ce=(0,o.useCallback)((function(){F.parent&&(K(c[F.parent]),"KDH"===F.parent?W({route:"/ KDH"}):W(s.find((function(e){return e.name===F.parent}))))}),[K,F,c]),be=(0,o.useCallback)((function(){}),[]),Ie=(0,o.useState)([]),ke=(0,a.Z)(Ie,2),Ne=ke[0],Se=ke[1],De=(0,o.useRef)(0),Ee=(0,o.useState)(0),Me=(0,a.Z)(Ee,2),Te=Me[0],Le=Me[1];(0,o.useEffect)((function(){if("IMAGE"===n.type){var e=(c[n.parent]||[]).filter((function(e){return"IMAGE"===e.type}));De.current=e.length,Se(e),Le(e.findIndex((function(e){return e.name===n.name})))}}),[c,n]);var Re=(0,o.useCallback)((function(){Le((function(e){return e-1>=0?e-1:0}))}),[]),_e=(0,o.useCallback)((function(){Le((function(e){return e+1<De.current?e+1:De.current-1}))}),[]),Ye=(0,o.useMemo)((function(){if("DOC"!==n.type)return null;console.log("item.name: ",n.name),console.log("projectDatas: ",j.j);var e=j.j.find((function(e){return e.projectName===n.name}));return console.log("target",e),{data:e,keys:Object.keys(e)||[]}}),[j.j,n]);(0,o.useEffect)((function(){return function(){localStorage.removeItem("".concat(t,"Left")),localStorage.removeItem("".concat(t,"Top")),localStorage.removeItem("".concat(t,"width")),localStorage.removeItem("".concat(t,"height"))}}),[]);var ze={onClick:ue,onClickClose:me,onClickMax:he,onClickNormalSize:pe,onClickMin:xe,onMouseDown:fe,onMouseUp:ve,onMouseDown_Resize:ye,onMouseUp_Resize:Ae,onClickItem:je,onDoubleClickItem:we,onClickLeft:Ce,onClickRight:be,setDisplayType:oe,boxRef:de,isClose:z,isMaxSize:Q,item:n,selectedItem:te,folderContents:U,displayType:ae,displayList:w,currentFolder:F,IMG_onClickLeft:Re,IMG_onClickRight:_e,imageArr:Ne,curImageIdx:Te,DOCData:Ye};return(0,h.jsx)(f,(0,i.Z)({},ze))},b=o.memo(C)}}]);
//# sourceMappingURL=11.e7682602.chunk.js.map
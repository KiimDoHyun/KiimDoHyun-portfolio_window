"use strict";(self.webpackChunkportfolio=self.webpackChunkportfolio||[]).push([[453],{453:function(e,n,t){t.r(n),t.d(n,{default:function(){return w}});var o,c,r,i=t(982),s=t(413),l=t(885),a=t(791),u=t(168),d=t(31),f=t(184),g=(d.ZP.div(o||(o=(0,u.Z)([""]))),80),h=(0,d.F4)(c||(c=(0,u.Z)(["\nfrom {\n    opacity: 0;\n    transform: scale(0.9);\n}\nto {\n    opacity: 1;\n    transform: scale(1);\n}\n"]))),p=d.ZP.div(r||(r=(0,u.Z)(["\n    left: calc(50% - 250px);\n    top: calc(50% - 250px);\n    height: 500px;\n    width: 500px;\n\n    box-shadow: 0px 0px 20px 3px #00000061;\n    position: absolute;\n\n    background-color: white;\n\n    z-index: ",";\n\n    display: grid;\n    grid-template-rows: 32px 25px 1fr 20px;\n\n    .modiSize {\n        position: absolute;\n        width: 4px;\n        height: 4px;\n        cursor: pointer;\n\n        // background-color: red;\n    }\n\n    .top_left {\n        top: 0;\n        left: 0;\n        cursor: nw-resize;\n    }\n\n    .top_right {\n        top: 0;\n        right: 0;\n        cursor: ne-resize;\n    }\n\n    .bottom_left {\n        bottom: 0;\n        left: 0;\n        cursor: ne-resize;\n    }\n\n    .bottom_right {\n        bottom: 0;\n        right: 0;\n        cursor: nw-resize;\n    }\n\n    .infoArea {\n        display: flex;\n        align-items: center;\n        gap: 5px;\n        height: 100%;\n        margin-left: 10px;\n    }\n\n    .infoArea img {\n        width: 20px;\n        height: 20px;\n    }\n    .infoArea div {\n        font-size: 14px;\n    }\n\n    .headerArea {\n        width: 100%;\n        height: 32px;\n\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n\n        padding: 1px 1px 0 1px;\n        box-sizing: border-box;\n    }\n\n    .headerArea2 {\n        padding: 0 10px;\n        border-bottom: 1px solid #e3e3e3;\n\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n    }\n\n    .buttonArea {\n        height: 100%;\n        display: flex;\n        gap: 1px;\n    }\n\n    .min div {\n        width: 11px;\n        height: 1px;\n        background-color: black;\n    }\n\n    .max div {\n        width: 8px;\n        height: 8px;\n        border: 1px solid black;\n    }\n\n    .close div {\n        width: 14px;\n        height: 1px;\n        background-color: black;\n    }\n\n    .close div:nth-child(1) {\n        position: absolute;\n        rotate: 45deg;\n    }\n\n    .close div:nth-child(2) {\n        rotate: 135deg;\n    }\n\n    .buttonArea > div {\n        height: 100%;\n        width: 45px;\n        transition: 0.2s;\n\n        display: flex;\n        align-items: center;\n        justify-content: center;\n    }\n\n    .buttonArea > div > img {\n        width: 10px;\n    }\n\n    .buttonArea .min:hover,\n    .buttonArea .normalSize:hover,\n    .buttonArea .max:hover {\n        background-color: #ddddddb3;\n    }\n\n    .buttonArea > .close:hover {\n        background-color: #ff1010;\n    }\n\n    animation: "," 0.25s 0s;\n\n    .contentsArea_Cover {\n        width: 100%;\n        height: 100%;\n        overflow: scroll;\n    }\n\n    // \ud3f4\ub354\ud615 \ucee8\ud150\uce20 \uc601\uc5ed\n    .contentsArea_folder {\n        width: 100%;\n        height: 100%;\n\n        padding: 10px;\n        box-sizing: border-box;\n\n        display: flex;\n        gap: 20px;\n        flex-wrap: wrap;\n\n        align-content: flex-start;\n    }\n\n    // \uc544\uc8fc \ud070 \uc544\uc774\ucf58\n    .BIG_BIG_ICON .folder {\n        width: ","px;\n    }\n\n    .BIG_BIG_ICON img {\n        width: ","px;\n        height: ","px;\n    }\n\n    // \ud070 \uc544\uc774\ucf58\n    .BIG_ICON .folder {\n        width: ","px;\n    }\n\n    .BIG_ICON img {\n        width: ","px;\n        height: ","px;\n    }\n\n    // \ubcf4\ud1b5 \uc544\uc774\ucf58\n    .MEDIUM_ICON .folder {\n        width: ","px;\n    }\n\n    .MEDIUM_ICON img {\n        width: ","px;\n        height: ","px;\n    }\n\n    // \uc791\uc740 \uc544\uc774\ucf58\n    .SMALL_ICON .folder {\n        width: ","px;\n    }\n\n    .SMALL_ICON img {\n        width: ","px;\n        height: ","px;\n    }\n\n    // \uc790\uc138\ud788\n    .DETAIL {\n        gap: 0px;\n    }\n\n    .DETAIL .folder {\n        width: 100%;\n        display: grid;\n        grid-template-columns: 1fr 1fr 1fr;\n    }\n    .DETAIL .folder div {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n    }\n\n    .DETAIL img {\n        width: ","px;\n        height: ","px;\n    }\n\n    .folder {\n        height: auto;\n        padding: 5px 10px;\n        border: 1px solid #ffffff00;\n    }\n\n    .folder_selected {\n        background-color: #cce8ff !important;\n        border: 1px solid #99d1ff;\n    }\n    .folder:hover {\n        background-color: #e5f3ff;\n    }\n    .folder .name {\n        word-break: break-all;\n        font-size: 12px;\n        cursor: default;\n    }\n\n    .detailHeader {\n        display: grid;\n        grid-template-columns: 1fr 1fr 1fr;\n        width: 100%;\n        padding: 5px 10px;\n    }\n\n    .detailHeader .name {\n        font-size: 11px;\n        cursor: default;\n    }\n\n    .bottomArea {\n        width: 100%;\n        display: flex;\n        align-items: center;\n        justify-content: flex-start;\n        font-size: 12px;\n        padding: 0 10px;\n    }\n\n    .arrowBox {\n        display: flex;\n        gap: 10px;\n    }\n    .arrowBox img {\n        width: 15px;\n        height: 100%;\n    }\n\n    .noContents {\n        width: 100%;\n        height: 100%;\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        color: gray;\n        font-size: 14px;\n        cursor: default;\n    }\n\n    ","\n"])),(function(e){return e.zIndexCnt}),h,160,160,160,120,120,120,g,g,g,40,40,40,20,20,(function(e){return e.isClose&&" opacity: 0; transform: scale(0.9)"})),A=function(e){var n=e.onClick,t=e.onClickClose,o=e.onClickMax,c=e.onClickNormalSize,r=e.onClickMin,i=e.onMouseDown,s=e.onMouseUp,l=e.onMouseDown_Resize,a=e.onMouseUp_Resize,u=e.onClickItem,d=e.onDoubleClickItem,g=e.onClickLeft,h=e.onClickRight,A=e.setDisplayType,x=e.boxRef,m=e.isClose,v=e.isMaxSize,C=e.item,w=e.selectedItem,y=e.folderContents,I=e.displayType,b=e.displayList;return(0,f.jsxs)(p,{ref:x,isClose:m,onMouseDown:n,isMaxSize:v,children:[(0,f.jsxs)("div",{className:"headerArea",onMouseDown:i,onMouseUp:s,children:[(0,f.jsxs)("div",{className:"infoArea",children:[(0,f.jsx)("img",{src:C.icon,alt:C.key}),(0,f.jsx)("div",{children:C.key})]}),(0,f.jsxs)("div",{className:"buttonArea",children:[(0,f.jsx)("div",{className:"min",onClick:r,children:(0,f.jsx)("div",{})}),v?(0,f.jsx)("div",{className:"normalSize",onClick:c,children:(0,f.jsx)("div",{})}):(0,f.jsx)("div",{className:"max",onClick:o,children:(0,f.jsx)("div",{})}),(0,f.jsxs)("div",{className:"close",onClick:t,children:[(0,f.jsx)("div",{}),(0,f.jsx)("div",{})]})]})]}),(0,f.jsxs)("div",{className:"headerArea2",children:[(0,f.jsxs)("div",{className:"arrowBox",children:[(0,f.jsx)("img",{src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAABL0lEQVRoge3YPy5EQRwH8E82tkCxnQM4gAM4ASEK4RwcgM4RxAVI9IQDEEpqDZL1pyA6jURWsdbGzr7ivRWzL/l9kum/3zdv3sw8QgghhBBC+GMreMQr1jJnqWwRH+h8j5e8caqZx7t+iQ6esyaqYA5vfpf4xHrOUGXN4snvEh1s5AxV1gxupCW2coYqq4VraYndnKHKmsK5tMQ+GhlzldLEqbTEESYy5iqlgUNpiQvdWaqNPWmJcR93uhv1j50xCFV1PNBfvJ1hU1RXdXy1brEwWKRosV9iesSH9O+aOJGWOVajz2/PJM6kZQ7UaEPsaeFKWqZWR5SeokPjds5QVRUd4zdzhqqq6GK1mjNUVcOuuvdZE41g8OdDO2+c0SzrHtTaWMqcJYQQQgghhHK+AHty7pyn/ARjAAAAAElFTkSuQmCC",alt:"leftArrow",onClick:g}),(0,f.jsx)("img",{src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAABHklEQVRoge3YsS4EQRwH4I8rRKh0XkDpAbzBiUQiuXfgISjUlEqtiifQ6OjVXFAIQaeRyCnukrM3rjAnmRv5f8kku8kWv99mdnZ2CSGEEEIIoTIdvOIRm4WzTOQFvcH4QLtsnHzPhkV6eMda0USZOvjULPOG1ZKhcm1rFunhCSslQ+XalZa5wXLJULkOpGWusVQyVI4ZHEvLXGGxYK4sLZxKy5xjrmCuLPO4kJY50y/asI7uDxdP+zgaLXI/BaFyxz7MjjaqUO/7SRu3yt/diafWNBv3sJ+oaEa19Fen0RJVLb/jXoiXWCiY69cOpSWq26LsSUtUt2nckZaobhu/5Z98WN1plqj2U/fBsETVPx829Mt0B8chhBBCCCH8nS/fx+6r2o1XMgAAAABJRU5ErkJggg==",alt:"rightArrow",onClick:h})]}),(0,f.jsx)("div",{children:(0,f.jsx)("select",{value:I,onChange:function(e){return A(e.target.value)},children:b.map((function(e,n){return(0,f.jsx)("option",{value:e.value,children:e.name},n)}))})})]}),(0,f.jsx)("div",{className:"contentsArea_Cover",children:"\uad6c\uae00"===C.key?(0,f.jsx)("iframe",{src:"https://www.google.com/webhp?igu=1",width:"100%",height:"100%"}):(0,f.jsx)("div",{className:"".concat(I," contentsArea_folder"),children:y&&y.length>0?(0,f.jsxs)(f.Fragment,{children:["DETAIL"===I&&(0,f.jsxs)("div",{className:"detailHeader",children:[(0,f.jsx)("div",{className:"name",children:"\uc774\ubbf8\uc9c0"}),(0,f.jsx)("div",{className:"name",children:"\uc774\ub984"}),(0,f.jsx)("div",{className:"name",children:"\uc720\ud615"})]}),y.map((function(e,n){return(0,f.jsxs)("div",{className:"".concat(w===e.name?"folder folder_selected":"folder"),onClick:function(){return u(e.name)},onDoubleClick:function(){return d(e)},children:[(0,f.jsx)("div",{className:"imgCover",children:"FOLDER"===e.type?(0,f.jsx)("img",{src:e.folderCnt?"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAEyElEQVRoge1YTYscVRQ9t7p7RgchaAZBXBg/EMGfoNGFbgLuBJdu8j8U3PgPXBlEEN0LYhDduHMjiAhuDBLxKzpOEshMHKfecVHvvbr3vlvVLSGK0Bea99HVXeece+591Q1sYxvb+F+HAMDxZw89QsglAOdB2SEAUMB8CYcJCAGoRxwJ8CUob5258P0H/wWBbhjkEoAXKngU8KgjMmgbskfKswl4//DjR98mB0H+zegAgMB56HtXoCPokVBVX+0LQFy8fvnca3cdsYucAeyMoJT6AZEx7B4BkN3rBx899vLdAhtFsZBF4vbaGtCXivMZ3jm4/MTTdwVtEAIAR58+zKZgKRmktlFTxOozahwuVp9t90q52M+MY77c7GUYJ0zy+SnSxcdf+ebqslzY7T+PxZNvALsPggRI5hvRrdWctGsQq/Qb9vpvIekEQAKY8sg89nlvGFnW7N3r1I7pFOApmP7a+fPWjRev//jdewCeW5ZULJ56E1zeD/ZEIkESKQ0jE5EIMK9T3SOYEjqcYIWb2Ot+xS6ugUc/IZ3eypIzS+Tmo8a62GZiCXQroLsX95y5Dw8sls8AX2AJALJzFsuTq5DjrweVZiPfrMtAFgRSD/TH4O1DpJM/ssIRaL2eIuDJyDgoW6/29rtMC9g59ypwdAVMx0AqqU7jyHaPYGCPAi5hUvmGgO7TU5mQYBzmSwDoVvtAfxwCNfMMmm4dktggCzSKcx4/R/CiOuRQA7y9HvwkcL32wC0Jrq0F2DUkg7fq1/ZdCYS2mQIfdZYJEsVqmxZzFOYtZSHRBLyi68CH6nubeUvldUVVLDNXwB54AY9qqWwhBaQB368HrTJCTBX2TAHP+b/iVuorS+UMTCkfgd+kuKOOpJWPSEDtBeq7OihTlYEJ26wFn8CI0KbqGzJzUc6DQijMwHDjEHxDpJ8obu33DQ+y0leamhCNFdY+pgZGTxs1tdcrwNFWDdGpcyAgIo3y0xkQuiKGVFJjBqJTd21n6tW+Vl2BpwftMxKBJ2znycAFdV+aLmQ6yBT4fgK8B54ccJ8N2LUG3jponKjT2HWhDJ4eRJuRefCWiOishPWg1Q8stOYQazJgANT1OvC+5w970rTRCRIA5juRspJk5f05QFiVPfDJzhQ9TlTwXpSpbvQP2ijbLLgMqBs3Voo6TQR+rh5SC9y01YiIe5SuWfDPQt7z1UrJFbcGHYGPLDV3NuT7h91IkSgdiJaQfRZqMlCsE/R184rAz3cmSwTBqNVHBu6yAP80qlNdgbtiDsYY/GZnQ0wiyIAGzoiAUX9Yt9ZhM0pYD3FxW+Blf7y/VPw06tPYJ79sEVs7GCLh6emV92dCBL6tBWnUj9uo1LYp4GQRO8BV/ajrRHVAS661kbWoNDYqJKIYLSQsRDpHwIOJlFcgxFtqssdbIuZ0nj2ZC3b9Q2a0T7Hbcrxy/KL1v2OnfK+yFmShPSPKXN/fhbKPKWJdA0Q3KLNOTa9+9JwTjkGnCjuTz4A7eVUG+rQLIP87fXjlk5uURf6xHFgoKrZZC23QZpun3SgD2rr5P1MQPXfx8w+/36gZSEe/XLj21bsf9n1/ts3h+hj45n+dKXVt53a8k+gWi4NutXjpjr5kG9vYxja2AQB/A6o4XE7+VqieAAAAAElFTkSuQmCC":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABf0lEQVRoge2ZPUvDUBSG39h84CyU1ioOMXToILWCf8Ctf8DBTfE3OBoUwUHEwUEHQcRf4u7iIogIOtihflBQ8tHkOhVyAzVgTtMmngcynCS89z73ngRCAIZhGCYFSrR4vUJbAc4EUPtjngDwAAUH1Q1cpp9eMpLA8wVeAMxRBAsBe2ETuxRZvyEJPJ5DEOcfmtvYIc6UkATuT8kFIIDj0MB+Ywvv1NlATODuhF6gbLZQNlcARUm+OYG+8x30uk/2zNrN3uCclHp7RCtQtVqoWC3KSPjOV6A3r9VBrUoXfbqBavVlVBabgAjpQgFoxnQpWssC/fQDqLqB+foSZq0GgCB9YNJ40WK1vQ5VN2iSiVd+GJKAqmmZDUyFKpf5mjwQF8jZ6gO8A+OnYALcQtlTMIG8t5DgHciegj0DuRfgFsqemMDov6Co4RYaNwUT4BbKnmLtgOe4gW5opWE3TwKe40vv+qlo8dHp2Z7jBhAhJvHwHDfovn2O/J8DwzDMP+IHy6i/03h8hHEAAAAASUVORK5CYII=",alt:"folderEmpty"}):(0,f.jsx)("img",{src:e.icon||"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAADI0lEQVRoge2ZyW7TUBRAT9IhcdKgoqqTmjKpn4DER7CDBX/AT8CSNWv4A9ix4xtYtBJCqBIFVEpoaZqENB4S2/G7LNKiUPxc22ncIuVI2dzr4R7fN0mBCRMmTLhMcrrEgwO5L8JLgbUsCwqhRo7Hb1Zzb8OSed1dSnhxBYoHqCK81CW1AkB1DMWkZV2XiBL4L/jvBaazfuHdGYdHRpvqlEctmOVVd55Nv5T6eZl24O6Mw5PKIRvTLsWcsDHt8rRyyL1ZJ/UzMxV4ZLRD4w+L4fE4ZCqwNuWHxquaeBwyFfgRzITGa5p4HDIVeNWdD42/1sTjkKnApl/imbnMTr9AT/Ls9As8M5dHWoVGXkaPj3p0Gi7kYX6pSOV6IfL6Tb80UsFnSS0gAgdfO7TrvT8xs+WyWC2zuF6+kOLikEpARKh96tBp9P7J1fcsVCAs35obubg4JBYQEb5vH9Npudprjmo2AqxkIJFIQAJh9+MvrLZ37rVHexaIsHK78lfc+uVitTwEuLZQoDw/m6jgs8QWCPqK3Q8t7OP4m079m4UIrN6pgEBz36bTdBE16KTd9ri+YrCwNuZVqO8pvrxv0bWS75iHJxKzhTx2SOea+w4qEBZvpJv45wr4vYDPW0163X6qFwAc7poYczMY5fDXtQ4cRGDpZnKJSAGvG7Cz1cB10hd/itPxECUUdRL7DiAs3Uw28bUCPavPp80GvhskemAUjumjFNpONH8MOpFkCdYKbL+r0/dV8irPwTE9EH0nmjUbEVi5HU9CK3CRX/4sdsdDBYIxF34KbXy3B0vwnUpofhitgEj6AuPgWD4CFEvhJRzt2YiC1Y1oCb2AGrMBQxM7QgKiJSI6MH4BGMwJpRRGKXxHrn+zyEUc+rUC6uLnrxbH7CMKjHL4nPj5xdTee6lDaBjH9E8kkp0vL30IDeNYHqIUxXL8A15EBy6kpsQ41mA4FTXD6SwRcyD7DpxiW6c79vkSV2oIDePYHoJglKIlrtwQGmZwdhJKERJRq1CNK/AfQdf0QXGsy2u3iECpxyJSExEu85fL5wIVyPPxfJ4JEyZMGJXfXUfSuVI0IAgAAAAASUVORK5CYII=",alt:e.name})}),(0,f.jsx)("div",{className:"name",children:e.name}),"DETAIL"===I&&(0,f.jsx)("div",{className:"name",children:e.type})]},n)}))]}):(0,f.jsx)("div",{className:"noContents",children:"\ube44\uc5b4\uc788\uc2b5\ub2c8\ub2e4."})})}),"FOLDER"===C.type&&(0,f.jsxs)("div",{className:"bottomArea",children:[y.length," \uac1c\ud56d\ubaa9"]}),(0,f.jsx)("div",{className:"modiSize top_left"}),(0,f.jsx)("div",{className:"modiSize top_right"}),(0,f.jsx)("div",{className:"modiSize right"}),(0,f.jsx)("div",{className:"modiSize bottom_left"}),(0,f.jsx)("div",{className:"modiSize bottom_right",onMouseDown:l,onMouseUp:a})]})},x=t(965),m=t(334),v=[{value:"BIG_BIG_ICON",name:"\uc544\uc8fc \ud070 \uc544\uc774\ucf58"},{value:"BIG_ICON",name:"\ud070 \uc544\uc774\ucf58"},{value:"MEDIUM_ICON",name:"\ubcf4\ud1b5 \uc544\uc774\ucf58"},{value:"SMALL_ICON",name:"\uc791\uc740 \uc544\uc774\ucf58"},{value:"DETAIL",name:"\uc790\uc138\ud788"}],C=function(e){var n=e.item;console.log("item: ",n);var t=n.key,o=n.status,c=(0,m.Zl)(x.uX),r=(0,m.FV)(x.wf),u=(0,l.Z)(r,2),d=u[0],g=u[1],h=d,p=(0,m.FV)(x.Pg),C=(0,l.Z)(p,2),w=C[0],y=C[1],I=(0,a.useState)(!1),b=(0,l.Z)(I,2),S=b[0],k=b[1],j=(0,a.useState)(!1),E=(0,l.Z)(j,2),B=E[0],R=E[1],D=(0,a.useState)(!1),L=(0,l.Z)(D,2),Y=L[0],M=L[1],T=(0,a.useState)(!1),X=(0,l.Z)(T,2),N=X[0],U=X[1],H=(0,a.useState)(n.contents||[]),Q=(0,l.Z)(H,2),V=Q[0],Z=Q[1],O=(0,a.useState)([n.contents]),z=(0,l.Z)(O,2),J=z[0],K=z[1],W=(0,a.useState)(""),G=(0,l.Z)(W,2),P=G[0],q=G[1],F=(0,a.useState)(v[2].value),_=(0,l.Z)(F,2),$=_[0],ee=_[1],ne=(0,a.useRef)(),te=(0,a.useRef)(),oe=(0,a.useCallback)((function(){y(t)}),[y,t]),ce=(0,a.useCallback)((function(){U(!0),te.current.style.transition="0.25s",te.current.style.left="0",te.current.style.top="0",localStorage.setItem("".concat(t,"width"),"100vw"),localStorage.setItem("".concat(t,"height"),"calc(100vh - 50px)"),te.current.style.width="100vw",te.current.style.height="calc(100vh - 50px)"}),[U,c]),re=(0,a.useCallback)((function(){U(!1);var e=localStorage.getItem("".concat(t,"Left")),n=localStorage.getItem("".concat(t,"Top"));te.current.style.transition="0.25s",e&&n?(te.current.style.left=e+"px",te.current.style.top=n+"px"):(te.current.style.left="calc(50vw - 250px)",te.current.style.top="calc(50vh - 250px)"),localStorage.setItem("".concat(t,"width"),"500px"),localStorage.setItem("".concat(t,"height"),"500px"),te.current.style.width="500px",te.current.style.height="500px"}),[U,c]),ie=(0,a.useCallback)((function(){c((function(e){return e.map((function(e){return e.key===t?(0,s.Z)((0,s.Z)({},e),{},{status:"min"}):(0,s.Z)({},e)}))}))}),[t,c]),se=(0,a.useCallback)((function(){M(!0),te.current.style.transition="0.25s",te.current.style.opacity="0",setTimeout((function(){c((function(e){return e.filter((function(e){return e.key!==t}))}))}),[300])}),[t,c]),le=(0,a.useCallback)((function(e){k(!0),ne.current={X:e.clientX,Y:e.clientY}}),[k]),ae=(0,a.useCallback)((function(e){if(S){var n=ne.current.X-e.clientX,o=ne.current.Y-e.clientY;ne.current={X:e.clientX,Y:e.clientY},te.current.style.transition="0s",localStorage.setItem("".concat(t,"Left"),te.current.offsetLeft-n),localStorage.setItem("".concat(t,"Top"),te.current.offsetTop-o),te.current.style.left=te.current.offsetLeft-n+"px",te.current.style.top=te.current.offsetTop-o+"px"}if(B){te.current.style.transition="0s";var c=ne.current.X-e.clientX,r=ne.current.Y-e.clientY,i=te.current.offsetWidth-c,s=te.current.offsetHeight-r;0===c&&r>0?(console.log("\uc704\ucabd"),s<60?console.log("\ucd5c\uc18c \ub192\uc774 \ubcf4\ub2e4 \ub0ae\uc2b5\ub2c8\ub2e4."):(localStorage.setItem("".concat(t,"height"),"".concat(te.current.offsetHeight-r,"px")),te.current.style.height=te.current.offsetHeight-r+"px",ne.current.Y=e.clientY)):0===c&&r<0?ne.current.Y<=e.clientY&&(console.log("\uc544\ub798\ucabd"),localStorage.setItem("".concat(t,"height"),"".concat(te.current.offsetHeight-r,"px")),te.current.style.height=te.current.offsetHeight-r+"px",ne.current.Y=e.clientY):c>0&&0===r?(console.log("\uc67c\ucabd"),i<300?console.log("\ub108\ube44\uac00 \ucd5c\uc18c \ud06c\uae30\ubcf4\ub2e4 \uc791\uc2b5\ub2c8\ub2e4."):(localStorage.setItem("".concat(t,"width"),"".concat(te.current.offsetWidth-c,"px")),te.current.style.width=te.current.offsetWidth-c+"px",ne.current.X=e.clientX)):c<0&&0===r?(console.log("\uc624\ub978\ucabd"),ne.current.X<=e.clientX&&(localStorage.setItem("".concat(t,"width"),"".concat(te.current.offsetWidth-c,"px")),te.current.style.width=te.current.offsetWidth-c+"px",ne.current.X=e.clientX)):c>0&&r>0?(console.log("\uc67c\ucabd \uc704"),i<300?console.log("\ub108\ube44\uac00 \ucd5c\uc18c \ud06c\uae30\ubcf4\ub2e4 \uc791\uc2b5\ub2c8\ub2e4."):(localStorage.setItem("".concat(t,"width"),"".concat(te.current.offsetWidth-c,"px")),te.current.style.width=te.current.offsetWidth-c+"px",ne.current.X=e.clientX),s<60?console.log("\ucd5c\uc18c \ub192\uc774 \ubcf4\ub2e4 \ub0ae\uc2b5\ub2c8\ub2e4."):(localStorage.setItem("".concat(t,"height"),"".concat(te.current.offsetHeight-r,"px")),te.current.style.height=te.current.offsetHeight-r+"px",ne.current.Y=e.clientY)):c<0&&r>0?(console.log("\uc624\ub978\ucabd \uc704"),ne.current.X<=e.clientX&&(console.log("prevPos.current.X: ",ne.current.X),console.log("e.clientX: ",e.clientX),localStorage.setItem("".concat(t,"width"),"".concat(te.current.offsetWidth-c,"px")),te.current.style.width=te.current.offsetWidth-c+"px",ne.current.X=e.clientX),s<60?console.log("\ucd5c\uc18c \ub192\uc774 \ubcf4\ub2e4 \ub0ae\uc2b5\ub2c8\ub2e4."):(localStorage.setItem("".concat(t,"height"),"".concat(te.current.offsetHeight-r,"px")),te.current.style.height=te.current.offsetHeight-r+"px",ne.current.Y=e.clientY)):c>0&&r<0?(console.log("\uc67c\ucabd \uc544\ub798"),i<300?console.log("\ub108\ube44\uac00 \ucd5c\uc18c \ud06c\uae30\ubcf4\ub2e4 \uc791\uc2b5\ub2c8\ub2e4."):(localStorage.setItem("".concat(t,"width"),"".concat(te.current.offsetWidth-c,"px")),te.current.style.width=te.current.offsetWidth-c+"px",ne.current.X=e.clientX),ne.current.Y<=e.clientY&&(localStorage.setItem("".concat(t,"height"),"".concat(te.current.offsetHeight-r,"px")),te.current.style.height=te.current.offsetHeight-r+"px",ne.current.Y=e.clientY)):c<0&&r<0&&(console.log("\uc624\ub978\ucabd \uc544\ub798"),ne.current.X<=e.clientX&&(console.log("prevPos.current.X: ",ne.current.X),console.log("e.clientX: ",e.clientX),localStorage.setItem("".concat(t,"width"),"".concat(te.current.offsetWidth-c,"px")),te.current.style.width=te.current.offsetWidth-c+"px",ne.current.X=e.clientX),ne.current.Y<=e.clientY&&(localStorage.setItem("".concat(t,"height"),"".concat(te.current.offsetHeight-r,"px")),te.current.style.height=te.current.offsetHeight-r+"px",ne.current.Y=e.clientY))}}),[S,B]),ue=(0,a.useCallback)((function(){k(!1)}),[]);(0,a.useEffect)((function(){w===t&&(te.current.style.zIndex=h+1,g((function(e){return e+1})))}),[w,t,g]),(0,a.useEffect)((function(){return document.addEventListener("mousemove",ae),document.addEventListener("mouseup",(function(){return R(!1)})),function(){document.removeEventListener("mousemove",ae)}}),[ae]),(0,a.useEffect)((function(){if("active"===o)if(N)te.current.style.left="0px",te.current.style.top="0px";else{var e=localStorage.getItem("".concat(t,"Left")),n=localStorage.getItem("".concat(t,"Top"));e&&n?(te.current.style.left=e+"px",te.current.style.top=n+"px"):(te.current.style.left="calc(50vw - 250px)",te.current.style.top="calc(50vh - 250px)")}}),[o,N,te]),(0,a.useEffect)((function(){if("active"===o){te.current.style.transition="0.25s",te.current.style.opacity="1";var e=localStorage.getItem("".concat(t,"height")),n=localStorage.getItem("".concat(t,"width"));e&&n?(te.current.style.height=e,te.current.style.width=n):(te.current.style.width="500px",te.current.style.height="500px"),te.current.style.scale="1"}else"min"===o&&(te.current.style.transition="0.25s",te.current.style.opacity="0",te.current.style.left="80px",te.current.style.top="60vh",te.current.style.scale="0.6",te.current.style.width="500px",te.current.style.height="500px")}),[o]);var de=(0,a.useCallback)((function(e){console.log("posX: ",e.clientX),R(!0),ne.current={X:e.clientX,Y:e.clientY}}),[]),fe=((0,a.useCallback)((function(){}),[]),(0,a.useCallback)((function(){R(!1)}),[])),ge=(0,a.useCallback)((function(e){q(e)}),[]),he=(0,a.useCallback)((function(e){console.log("item: ",e),"FOLDER"===e.type&&(J.some((function(n){return n.name===e.name}))||K((function(n){return[].concat((0,i.Z)(n),[e.contents])})),Z(e.contents))}),[J]),pe=(0,a.useCallback)((function(){Z(J[0])}),[]),Ae=(0,a.useCallback)((function(){}),[]);(0,a.useEffect)((function(){return function(){localStorage.removeItem("".concat(t,"Left")),localStorage.removeItem("".concat(t,"Top")),localStorage.removeItem("".concat(t,"width")),localStorage.removeItem("".concat(t,"height"))}}),[]);var xe={onClick:oe,onClickClose:se,onClickMax:ce,onClickNormalSize:re,onClickMin:ie,onMouseDown:le,onMouseUp:ue,onMouseDown_Resize:de,onMouseUp_Resize:fe,onClickItem:ge,onDoubleClickItem:he,onClickLeft:pe,onClickRight:Ae,setDisplayType:ee,boxRef:te,isClose:Y,isMaxSize:N,item:n,selectedItem:P,folderContents:V,displayType:$,displayList:v};return(0,f.jsx)(A,(0,s.Z)({},xe))},w=a.memo(C)}}]);
//# sourceMappingURL=453.5b9422ab.chunk.js.map
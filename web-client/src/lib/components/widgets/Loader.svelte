
<style>
    .loader {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: inline-block;
        border-top: 4px dotted #000;
        border-right: 4px sold transparent;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
        }
        .loader::after {
        content: '';  
        box-sizing: border-box;
        position: absolute;
        left: 0;
        top: 0;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border-bottom: 4px dashed #FF3D00;
        border-left: 4px solid transparent;
        }
        @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        25% {
            transform: rotate(160deg);
        }
        50% {
            transform: rotate(180deg);
        }
        75% {
            transform: rotate(340deg);
        }
        100% {
            transform: rotate(360deg);
        }
        } 
</style>

<div style="display: flex;">
    <span style="flex: 1 0 0;"></span>
    <span style="flex: 0 0 48px;" class="mt-5 loader"></span>
    <span style="flex: 1 0 0;"></span>
</div>
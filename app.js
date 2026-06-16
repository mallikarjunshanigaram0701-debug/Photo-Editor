const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const upload = document.getElementById("upload");

let img = null;

const state = {

    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,

    rotation: 0,

    zoom: 1,

    flipX: 1,
    flipY: 1,

    filter: "normal"
};

const FILTERS = {

    normal: "",

    vintage: "sepia(70%)",

    bw: "grayscale(100%)",

    warm: "sepia(30%) saturate(150%)",

    cool: "hue-rotate(25deg)",

    cinema: "contrast(140%) saturate(80%)"
};

upload.addEventListener("change", e => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = event => {

        img = new Image();

        img.onload = () => {

            canvas.width = img.width;
            canvas.height = img.height;

            render();
        };

        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
});

function render() {

    if (!img) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    ctx.translate(canvas.width / 2, canvas.height / 2);

    ctx.rotate(state.rotation * Math.PI / 180);

    ctx.scale(
        state.zoom * state.flipX,
        state.zoom * state.flipY
    );

    ctx.filter = `
        brightness(${state.brightness}%)
        contrast(${state.contrast}%)
        saturate(${state.saturation}%)
        blur(${state.blur}px)
        ${FILTERS[state.filter]}
    `;

    ctx.drawImage(
        img,
        -img.width / 2,
        -img.height / 2
    );

    ctx.restore();
}

document.getElementById("brightness").oninput = e => {

    state.brightness = e.target.value;
    render();
};

document.getElementById("contrast").oninput = e => {

    state.contrast = e.target.value;
    render();
};

document.getElementById("saturation").oninput = e => {

    state.saturation = e.target.value;
    render();
};

document.getElementById("blur").oninput = e => {

    state.blur = e.target.value;
    render();
};

document.querySelectorAll(".filter").forEach(btn => {

    btn.addEventListener("click", () => {

        state.filter = btn.dataset.filter;

        render();
    });

});

document.getElementById("rotateLeft").onclick = () => {

    state.rotation -= 90;
    render();
};

document.getElementById("rotateRight").onclick = () => {

    state.rotation += 90;
    render();
};

document.getElementById("flipX").onclick = () => {

    state.flipX *= -1;
    render();
};

document.getElementById("flipY").onclick = () => {

    state.flipY *= -1;
    render();
};

document.getElementById("zoomIn").onclick = () => {

    state.zoom += 0.1;
    render();
};

document.getElementById("zoomOut").onclick = () => {

    state.zoom = Math.max(0.1, state.zoom - 0.1);

    render();
};

document.getElementById("reset").onclick = () => {

    state.brightness = 100;
    state.contrast = 100;
    state.saturation = 100;
    state.blur = 0;

    state.rotation = 0;
    state.zoom = 1;

    state.flipX = 1;
    state.flipY = 1;

    state.filter = "normal";

    document.getElementById("brightness").value = 100;
    document.getElementById("contrast").value = 100;
    document.getElementById("saturation").value = 100;
    document.getElementById("blur").value = 0;

    render();
};

document.getElementById("download").onclick = () => {

    if (!img) return;

    const link = document.createElement("a");

    link.download = "edited-image.png";

    link.href = canvas.toDataURL("image/png");

    link.click();
};

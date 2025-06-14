let dp: File | null = null


const generateTicketOnClick = () => {
    try {
        const form = document.getElementById("form-id")! as HTMLFormElement
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            if (!dp){
                throw new Error("dp missing")
            }
            const formData = new FormData(form)
            const ticketTemplate = document.getElementById('ticket-template')! as HTMLTemplateElement
            const main = document.querySelector("main")!
            const name = formData.get("fullname")!.toString()
            const email = formData.get("email")!.toString()
            const github = formData.get("githubUsername")!.toString()
            const heading = document.getElementById("main-heading")!
            const subHeading = document.getElementById("header-subheading")!
            heading.textContent = `Congrats ${name}! Your ticket is ready`
            subHeading.innerHTML = `We've emailed your ticket to <span class='red-text'>${email}</span> and will send updates in the run up to the event`
            const templateContent = ticketTemplate.content.cloneNode(true) as DocumentFragment;

            const p = templateContent.getElementById("date-location-ticket")!
            p.textContent= `${new Date().toDateString()} / Abuja, Ng`

            const sectionTwo = templateContent.getElementById("ticket-section-2")!
            const h3 = sectionTwo.querySelector("h3")!
            const img = sectionTwo.querySelector("img")!
            const git = templateContent.getElementById("github-account")!
            h3.textContent = name
            displayImage(dp!, img)
            git.textContent = github
            main.innerHTML = ''; // Clear existing content
            main.appendChild(templateContent);

        })
    } catch (error) {
        console.log("generate ticker error: ", error)
    }
}

generateTicketOnClick();

const displayImage = (file: File, imgElement: HTMLImageElement) => {
    const reader = new FileReader()

    reader.onload = (e) => {
        imgElement.src = e.target?.result as string
        imgElement.width = 64
        imgElement.height = 64
        imgElement.alt = "uploaded image"
        console.log(imgElement.classList)
        imgElement.className = ""
        imgElement.style.borderRadius = "10px"
    }

    reader.readAsDataURL(file)
}

const ticketUpload = () => {
    try {
        const uploadElement = document.getElementById('ticket-form-upload-id')!.querySelector("img")!
        const fileInput = document.getElementById('file-input')!
        const info = document.getElementById('ticket-upload-info-id')!
        const uploaded = document.getElementById('uploaded-image-div-id')!
        const preUploaded = document.getElementById('pre-uploaded-image-p-id')!
        const msg = info.querySelector("span")!
        const changeImageBtn = document.getElementById('change-image')
        const removeImageBtn = document.getElementById('remove-image')

        const allowedTypes = ['image/jpeg', 'image/png']

        uploadElement.addEventListener('click', () => {
            fileInput.click()
        })

        if (changeImageBtn) {
            changeImageBtn.addEventListener('click', () => {
                fileInput.click()
            })
        }

        if (removeImageBtn) {
            removeImageBtn.addEventListener('click', () => {
                dp = null
                uploadElement.src = "../assets/images/icon-upload.svg"
                uploadElement.style = ""
                uploadElement.classList.add("ticket-form-upload-img")
                uploaded.classList.add("hidden")
                preUploaded.classList.remove("hidden")
            })
        }

        fileInput.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement
            if (target.files && target.files.length > 0) {
                const err = "file size too large or not jpeg or png";
                const file = target.files[0]
                if (file.size > (500 * 1024) || !allowedTypes.includes(file.type)) { // not successful
                    info.classList.add("error")
                    msg.textContent = err
                    uploaded.classList.add("hidden")
                    preUploaded.classList.remove("hidden")
                    throw new Error(err)
                } else {
                    info.classList.remove("error")
                    uploaded.classList.remove("hidden")
                    preUploaded.classList.add("hidden")
                    msg.textContent = "upload your photo (JPG or PNG, max size: 500kb)."
                    dp = file
                    displayImage(file, uploadElement)
                }
            }else{
                throw new Error("must upload an image")
            }
        })
    } catch (error) {
        console.log("error uploading ticket: ", error)
    }
}

ticketUpload()
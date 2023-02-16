// Grades
const selectedGrade = document.getElementById("grade");
const coursesBody = document.getElementById("courses");
const gradeOptionLetter = document.getElementById("gradeOptionLetter");
const gradeOptionPercentage = document.getElementById("gradeOptionPercentage");
const coursesNote = document.getElementById("note");
// GPA
const gpa = document.getElementById("gpa");
const warn = document.getElementById("warn");

var gradeOption = "Letter";
const LETTERS = ["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","D-","F"];

const gradeCourses = {
    "9": [
        "English",
        "Math",
        "Science",
        "Social Studies",
        ["German", "French", "Spanish"],
        "Physical Education"
    ],
    "10": [
        "English",
        "Math",
        "Chemistry",
        "Social Studies",
        ["German", "French", "Spanish"],
        "Physical Education"
    ],
    "11": [
        "English",
        "Math",
        "Physics",
        ["Business", "Media", "Political Science", "Psychology"],
        ["Architecture", "Business", "Economics", "French", "German", "Spanish"],
        ["Business", "Computer Science", "Sociology"],
        "Physical Education"
    ],
    "12": [
        ["English", "AP English"],
        ["Calculus", "AP Calculus", "Business Math", "Accounting"],
        ["Business", "AP Physics", "Architecture", "Biology"],
        ["Adv. Chemistry", "Adv. Computer Science", "Business Math", "US History"],
        ["Art/AP Art", "AP Psychology", "Environmental Science", "Graphic Design"],
        "Physical Education"
    ]
};
const letterToGPA = {
    "A+": 4, "A": 4, "A-": 3.9,
    "B+": 3.7, "B": 3.4, "B-": 3,
    "C+": 2.7, "C": 2.4, "C-": 2,
    "D+": 1.7, "D": 1.4, "D-": 1,
    "F": 0
};
const percentageToGPA = {
    "4": { max: 100, min: 93 },
    "3.9": { max: 93, min: 90 },
    "3.7": { max: 90, min: 87 },
    "3.4": { max: 87, min: 83 },
    "3": { max: 83, min: 80 },
    "2.7": { max: 80, min: 77 },
    "2.4": { max: 77, min: 73 },
    "2": { max: 73, min: 70 },
    "1.7": { max: 70, min: 67 },
    "1.4": { max: 67, min: 63 },
    "1": { max: 63, min: 60 },
    "0": { max: 60, min: 0 }
};

// Change grades to letters
gradeOptionLetter.addEventListener("click", () => {
    gradeOption = "Letter";
    gradeOptionLetter.className = "gradeOption selectedGradeOption";
    gradeOptionPercentage.className = "gradeOption";
    changeGrade();
    calculateGPA();
});

// Change grades to percentage
gradeOptionPercentage.addEventListener("click", () => {
    gradeOption = "Percentage";
    gradeOptionLetter.className = "gradeOption";
    gradeOptionPercentage.className = "gradeOption selectedGradeOption";
    changeGrade();
    calculateGPA();
});

// Change Grade Level
function changeCourse() {
    coursesBody.innerHTML = "";
    gradeCourses[selectedGrade.value].forEach(course => {
        // <tr>
        const tr = document.createElement("tr");
        tr.className = "course";
        // Course Name
        const td1 = document.createElement("td");
        if (Array.isArray(course)) {
            /**
             * <select>
             *     <option>English</option>
             *     <option>AP English</option>
             * </select>
             */
            const select = document.createElement("select");
            course.forEach(c => {
                const option = document.createElement("option");
                option.innerHTML = c;
                select.appendChild(option);
            });
            td1.appendChild(select);
        } else {
            // <span>Physical Education</span>
            const p = document.createElement("p");
            p.innerHTML = course;
            td1.appendChild(p);
        }
        tr.appendChild(td1);
        
        // Grades' tds
        const td2 = document.createElement("td");
        tr.appendChild(td2);

        coursesBody.appendChild(tr);
    });
    if (selectedGrade.value === "9") {
        coursesNote.innerHTML = "Note: Art, Music, Innovation Lab, Computer<br>Science, Drama, and Marital Arts have no credits.";
        coursesNote.parentElement.parentElement.style.display = "table-row";
    } else if (selectedGrade.value === "10") {
        coursesNote.innerHTML = "Note: Computer Science, Art, Music,<br>and Marital Arts have no credits.";
        coursesNote.parentElement.parentElement.style.display = "table-row";
    } else {
        coursesNote.innerHTML = "";
        coursesNote.parentElement.parentElement.style.display = "none";
    }
    changeGrade();
}

// Change Grading System
function changeGrade() {
    const trs = [...coursesBody.children];
    trs.forEach(tr => {
        // Grade
        const td = tr.children.item(1);
        td.innerHTML = "";
        if (gradeOption === "Percentage") {
            // <input type="number" min="0" max="100">
            const input = document.createElement("input");
            input.type = "number";
            input.min = "0";
            input.max = "100";
            input.addEventListener("input", calculateGPA);
            input.addEventListener("change", calculateGPA);
            td.appendChild(input);
        } else if (gradeOption === "Letter") {
            // <select> with all the letters
            const select = document.createElement("select");
            select.addEventListener("change", calculateGPA);
            for (let i = 0; i < 13; i++) {
                const option = document.createElement("option");
                option.innerHTML = LETTERS[i];
                select.appendChild(option);
            }
            td.appendChild(select);
        }
    });
}
selectedGrade.addEventListener("change", changeCourse);
changeCourse();

// Calculate GPA
function calculateGPA() {
    warn.style.display = "none";
    const coursesTrs = [...document.getElementsByClassName("course")];
    var credits = 0;
    var grade = 0;
    // Get all courses
    coursesTrs.forEach(tr => {
        const tds = [...tr.children];
        if (gradeOption === "Percentage") {
            // Check if empty
            if (tds[1].firstChild.value.length === 0) return;
            if (0 > Number(tds[1].firstChild.value) || Number(tds[1].firstChild.value) > 100) return warn.style.display = "block";
            for (const g in percentageToGPA) if (percentageToGPA[g].min <= Number(tds[1].firstChild.value) && Number(tds[1].firstChild.value) < percentageToGPA[g].max) {
                grade += Number(g) * ((tds[0].firstChild.innerText === "Physical Education") ? 0.5 : 1);
                break;
            }
        } else if (gradeOption === "Letter") grade += letterToGPA[tds[1].firstChild.value] * ((tds[0].firstChild.innerText === "Physical Education") ? 0.5 : 1);
        if (tds[0].firstChild.innerText === "Physical Education") credits += 0.5;
        else credits += 1;
    });
    if (credits !== 0) gpa.innerHTML = "GPA: " + Math.round(grade / credits * 100) / 100;
    else gpa.innerHTML = "GPA: 0";
}
calculateGPA();

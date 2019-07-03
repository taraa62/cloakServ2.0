import {DonorEditController} from "../submodule/donor_editor/DonorEditController";
import {EProcessEdit, IMessageWorkerEditTextReq} from "../submodule/donor_editor/workers/EEditText";

export class TestEditController {


    public static test1(controller: DonorEditController) {
        setTimeout(() => {
            const task: IMessageWorkerEditTextReq = {
                command: "editFile",
                url: "/",
                pathToFile: "/home/taras/Документы/svn/cloakServ2.0/resource/test1.html",
                contentType: "text/html",
                host: "t62.com",
                process: EProcessEdit.POST
            }

            controller.getPool().newTask(task);
        }, 2000)


    }
}

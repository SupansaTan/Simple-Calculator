import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { EventData } from "@nativescript/core";
import { Button } from "@nativescript/core/ui/button";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
    @ViewChild("display_num", { static: false }) expLabel: ElementRef;
    @ViewChild("display_result", { static: false }) resultLabel: ElementRef;

    constructor() {
    }

    ngOnInit(): void {

    }

    precedence(op) {
        // precedence of operator
        if (op == '+' || op == '-') {
            return 1;
        }
        if (op == 'x' || op == '/') {
            return 2;
        }
        return 0;
    }

    calculate(num1, num2, op) {
        if (op == '+') { return num1 + num2 }
        if (op == '-') { return num1 - num2 }
        if (op == 'x') { return num1 * num2 }
        if (op == '/') { return num1 / num2 }
    }

    clear_btn() {
        this.expLabel.nativeElement.text = "0";
        this.resultLabel.nativeElement.text = "=";
    }

    backspace_btn() {
        let text_label = this.expLabel.nativeElement.text;
        let slice_text = text_label.slice(0, text_label.length - 1);

        if (slice_text == "" || text_label == "0") {
            this.expLabel.nativeElement.text = "0";
        }
        else {
            this.expLabel.nativeElement.text = slice_text;
        }
    }

    addExp(args: EventData) {
        var button = <Button>args.object;
        var value = button.text;
        var text_label = this.expLabel.nativeElement.text;
        var result_label = this.resultLabel.nativeElement.text;

        if (text_label == "0") {
            this.expLabel.nativeElement.text = value;
        }
        else {
            this.expLabel.nativeElement.text = text_label + value;
        }
    }

    evaluate() {
        var num1, num2, op;
        var values = [];
        var operators = [];
        var i = 0; // start index
        var expression = this.expLabel.nativeElement.text;

        while (i < expression.length) {
            // if current expression is numeric
            if (!isNaN(expression[i])) {
                var num = "";

                while (i < expression.length && (!isNaN(expression[i]) || expression[i] == '.')) {
                    // current expression is numeric or decimal point
                    num += expression[i];
                    i++;
                }
                values.push(parseFloat(num));
                i--;
            }

            // if current expression is operator
            else {
                // when have operator in operators array
                while (operators.length != 0 && this.precedence(operators[operators.length - 1]) >= this.precedence(expression[i])) {
                    num2 = values.pop();
                    num1 = values.pop();
                    op = operators.pop();
                    values.push(this.calculate(num1, num2, op));
                }

                // not have operator in operators array 
                operators.push(expression[i]);
            }
            i++;
        }
        // if remain operator and number in array
        while (operators.length != 0 && (values.length > 1)) {
            num2 = values.pop();
            num1 = values.pop();
            op = operators.pop();
            values.push(this.calculate(num1, num2, op));
        }
        this.resultLabel.nativeElement.text = "= " + values[values.length - 1]; // show result
    }

    pow_btn() {
        var result;
        var exp_label = this.expLabel.nativeElement.text;
        var result_label = this.resultLabel.nativeElement.text;

        if (result_label == '=') { // if never press evaluate button
            // get number
            let numbers = exp_label.split('x').join(',').split('+').join(',').split('-').join(',').split('÷').join(',');
            let list_numbers = numbers.split(",");
            let last_number = parseFloat(list_numbers.pop());

            result = Math.pow(last_number, 2);
            let slice_text = exp_label.slice(0, exp_label.length - last_number.toString().length);
            this.expLabel.nativeElement.text = slice_text + result.toString();
        }
        else {
            // ever pressed evaluate button
            let result_label_number = parseFloat(result_label.slice(2, result_label.length))
            result = Math.pow(result_label_number, 2);
            this.expLabel.nativeElement.text = '' + result;
            this.resultLabel.nativeElement.text = '= ' + result;
        }
    }
}

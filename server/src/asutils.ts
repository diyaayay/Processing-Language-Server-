import { ParseTree } from "antlr4ts/tree/ParseTree";
import { connect } from 'http2';
import { ClassDeclarationContext, VariableDeclaratorContext, MethodDeclarationContext } from "java-ast/dist/parser/JavaParser";
import { connection } from './server';

export let memberNames: string[] = [];
export let numberOfMembers = 0;
export let fieldNames: string[] = [];
export let numberOfFields = 0;
export let classNames: string[] = [];
export let numberOfClasses = 0;
export let fieldAndClass: [string,string][] = [];
export let FCCount = 0;
export let memberAndClass: [string,string][] = [];
export let MCCount = 0;

export function constructClassParams(tokenArr: [ParseTree, ParseTree][]) {
	tokenArr.forEach(function(node, index) {
		//local class declarations
		if(node[1] instanceof ClassDeclarationContext && node[0].text == `class` ) {
			classNames[numberOfClasses] = tokenArr[index+1][0].text;
			numberOfClasses+=1;
		}
		if(node[1] instanceof MethodDeclarationContext) {
			// MethodDeclarationContext -> MemberDeclarationContext -> ClassBodyDeclarationContext -> ClassBodyContext -> ClassDeclarationContext -> 
			// 2nd Child [Terminal Node: Class name]
			memberAndClass[MCCount] = [node[1]._parent!._parent!._parent!._parent!.getChild(1).text,node[0].text];
			MCCount+=1;
			memberNames[numberOfMembers] = node[0].text;
			numberOfMembers +=1;

		}
		if(node[1] instanceof VariableDeclaratorContext) {
			fieldAndClass[FCCount] = [node[1]._parent!._parent!._parent!._parent!._parent!._parent!._parent!.getChild(1).text,node[0].text];
			FCCount += 1;
			fieldNames[numberOfFields] = node[0].text;
			numberOfFields += 1;
		}
	});
	connection.console.log("Local Class Completion Invoked");
}


export function clearClassName() { 
	classNames= [];
	numberOfClasses=0;
}
export function clearMemberName() {
	memberNames =[];
	numberOfMembers=0;
}

export function clearFieldName(){
	fieldNames = [];
	numberOfFields = 0;
}

export function clearFieldAndClass(){
	fieldAndClass = [];
	FCCount = 0;
}

export function clearMemberAndClass(){
	memberAndClass = [];
	MCCount = 0;
}

export function flushRecords(){
	clearClassName();
	clearFieldName();
	clearMemberName();
	clearFieldAndClass();
	clearMemberAndClass();
}
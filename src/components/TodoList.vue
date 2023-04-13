<template>
  <div
    :class="`d-flex scrollable overflow-x-auto fill-height pb-16 ${
      theme ? 'bgLight' : 'bgDark'
    }`"
  >
    <div v-for="(todoList, todoListIndex) in todoLists" :key="todoListIndex">
      <v-card
        color="bg"
        width="350"
        max-width="350"
        :theme="themeMode"
        variant="flat"
        class="ma-5"
        :title="todoList.title"
        elevation="5"
      >
        <template v-slot:append>
          <div class="me-n2">
            <v-btn
              icon="$close"
              density="comfortable"
              variant="plain"
              @click="deleteTodoList(todoListIndex)"
            ></v-btn>
          </div>
        </template>

        <draggable :list="todoList.tasks" group="taks" itemKey="title">
          <template #item="{ element, taskIndex }">
            <v-card
              class="ma-4 draggable"
              color="bgTask"
              rounded="lg"
              variant="flat"
            >
              <v-card-item>
                <v-card-title class="text-body-2 d-flex">
                  <div class="text-h6 pre-line">
                    {{ element.title }}
                  </div>
                  <v-spacer></v-spacer>
                  <v-btn
                    icon="$close"
                    size="small"
                    variant="text"
                    @click="deleteTask(taskIndex, todoListIndex)"
                  ></v-btn>
                </v-card-title>
                <div class="py-2" v-show="element.description">
                  <div class="font-weight-light text-medium-emphasis pre-line">
                    {{ element.description }}
                  </div>
                </div>
              </v-card-item>
            </v-card>
          </template>
        </draggable>

        <v-card-actions v-if="!todoList.showForm">
          <v-btn prepend-icon="mdi-plus" @click="toggleTaskForm(todoListIndex)">
            <template v-slot:prepend>
              <v-icon></v-icon>
            </template>
            Ajouter une tâche
          </v-btn>
        </v-card-actions>
        <form v-if="todoList.showForm" @submit.prevent="addTask(todoListIndex)">
          <div class="ma-4">
            <v-text-field
              v-model.trim="newTaskTitle"
              label="Titre"
              autofocus
            ></v-text-field>
            <v-text-field
              v-model.trim="newTaskDescription"
              label="Description"
            ></v-text-field>
            <v-btn class="me-2" type="submit" :disabled="isDisabledNewTask">
              Ajouter
            </v-btn>
            <v-btn @click="cancelNewTask(todoListIndex)"> Annuler </v-btn>
          </div>
        </form>
      </v-card>
    </div>

    <div>
      <v-card
        color="bg"
        width="300"
        :theme="themeMode"
        variant="flat"
        class="ma-5"
        elevation="5"
      >
        <v-card-actions v-if="!showFormTodoList">
          <v-btn prepend-icon="mdi-plus" @click="showFormTodoList = true">
            <template v-slot:prepend>
              <v-icon></v-icon>
            </template>
            Ajouter une liste
          </v-btn>
        </v-card-actions>
        <form v-if="showFormTodoList" @submit.prevent="addTodoList">
          <div class="ma-4">
            <v-text-field
              v-model.trim="newTodoListTitle"
              label="Titre"
              autofocus
            ></v-text-field>
            <v-btn class="me-2" type="submit" :disabled="isDisabledNewTodoList">
              Ajouter
            </v-btn>
            <v-btn @click="cancelNewTodoList"> Annuler </v-btn>
          </div>
        </form>
      </v-card>
    </div>
    <toggle-theme-btn
      :toggleTheme="toggleTheme"
      :theme="theme"
      :themeMode="themeMode"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import ToggleThemeBtn from "./ToggleThemeBtn.vue";
import { TodoList } from "../types";
import draggable from "vuedraggable";

let todoLists = reactive<TodoList[]>([
  {
    title: "A faire",
    tasks: [
      {
        title: "Projet",
        description: "Application vuejs",
      },
      {
        title: "Sport",
        description: "Exercices 30min",
      },
      {
        title: "Rangement",
        description: "",
      },
    ],
    showForm: false,
  },
  {
    title: "En cours",
    tasks: [
      {
        title: "CV",
        description: "Mettre à jour",
      },
    ],
    showForm: false,
  },
  {
    title: "Terminer",
    tasks: [],
    showForm: false,
  },
]);

watch(todoLists, (newVal) => {
  console.log("my todolist has been modified: ", newVal);
});

const theme = ref<boolean>(true);
const showFormTodoList = ref<boolean>(false);
const newTodoListTitle = ref<string>("");
const newTaskTitle = ref<string>("");
const newTaskDescription = ref<string>("");
const isDialogVisible = ref<boolean>(false);

const themeMode = computed(() => (theme.value ? "light" : "dark"));

const toggleTheme = () => {
  theme.value = !theme.value;
};

//Functions todolist

const isDisabledNewTodoList = computed(
  () => newTodoListTitle.value.trim() === ""
);

const addTodoList = () => {
  if (newTodoListTitle.value !== "") {
    todoLists.push({
      title: newTodoListTitle.value,
      tasks: [],
      showForm: false,
    });
    newTodoListTitle.value = "";
    showFormTodoList.value = false;
  }
};

const cancelNewTodoList = () => {
  showFormTodoList.value = false;
  newTodoListTitle.value = "";
};

const deleteTodoList = (listIndex: number) => {
  todoLists.splice(listIndex, 1);
  isDialogVisible.value = false;
};

// Functions task

const isDisabledNewTask = computed(() => newTaskTitle.value.trim() === "");

const addTask = (listIndex: number) => {
  if (newTaskTitle.value !== "") {
    const activeList = todoLists[listIndex];
    if (activeList) {
      activeList.tasks.push({
        title: newTaskTitle.value,
        description: newTaskDescription.value,
      });
    }
    newTaskTitle.value = "";
    newTaskDescription.value = "";
    activeList.showForm = false;
  }
};

const cancelNewTask = (listIndex: number) => {
  const activeList = todoLists[listIndex];
  activeList.showForm = false;
  newTaskTitle.value = "";
  newTaskDescription.value = "";
};

const deleteTask = (taskIndex: number, listIndex: number) => {
  const activeList = todoLists[listIndex];
  if (activeList) {
    activeList.tasks.splice(taskIndex, 1);
  }
};

const toggleTaskForm = (listIndex: number) => {
  newTaskTitle.value = "";
  newTaskDescription.value = "";
  for (let i = 0; i < todoLists.length; i++) {
    if (i !== listIndex) {
      todoLists[listIndex].showForm = false;
    }
    if ((todoLists[i].showForm = true)) {
      todoLists[i].showForm = false;
    }
  }
  todoLists[listIndex].showForm = !todoLists[listIndex].showForm;
};
</script>

<script lang="ts">
export default {
  name: "TodoList",
  components: {
    draggable,
  },
};
</script>

<style>
.bgLight {
  background-image: url("../assets/bgLight.png");
  background-repeat: repeat;
  background-color: #eeeeee;
}

.bgDark {
  background-image: url("../assets/bgDark.png");
  background-repeat: repeat;
  background-color: #202225;
}

.pre-line {
  white-space: pre-line;
}

input:focus {
  outline: none;
}

.v-btn {
  text-transform: none;
}

.draggable {
  cursor: pointer;
}
</style>
